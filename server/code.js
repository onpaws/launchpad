/* @flow */

export const STARTER_CODE = `// Welcome to Launchpad!
// Log in to edit and save pads, run queries in GraphiQL on the right.
// Click "Download" above to get a zip with a standalone Node.js server.
// See docs and examples at https://github.com/apollographql/awesome-launchpad

// graphql-tools combines a schema string with resolvers.
import { makeExecutableSchema } from 'graphql-tools';

// Construct a schema, using GraphQL schema language
const typeDefs = \`
  type Query {
    hello: String
  }
\`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (root, args, context) => {
      return 'Hello world!';
    },
  },
};

// Required: Export the GraphQL.js schema object as "schema"
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Optional: Export a function to get context from the request. It accepts two
// parameters - headers (lowercased http headers) and secrets (secrets defined
// in secrets section). It must return an object (or a promise resolving to it).
export function context(headers, secrets) {
  return {
    headers,
    secrets,
  };
};

// Optional: Export a root value to be passed during execution
// export const rootValue = {};

// Optional: Export a root function, that returns root to be passed
// during execution, accepting headers and secrets. It can return a
// promise. rootFunction takes precedence over rootValue.
// export function rootFunction(headers, secrets) {
//   return {
//     headers,
//     secrets,
//   };
// };
`;

export const RUNNER_WRAPPER = (code: string) =>
  `
var __LAUNCHPAD__runtimeError;
try {
  ${code}
} catch (e) {
  __LAUNCHPAD__runtimeError = e;
}

(function () {
  if (__LAUNCHPAD__runtimeError) {
    module.exports = function webtask(context, callback) {
      callback(__LAUNCHPAD__runtimeError);
    }
    return;
  }

  var graphql = require('graphql');

  var schema = exports.schema;
  var rootValue = exports.rootValue || {};
  var rootFunction = exports.rootFunction || function () {
    return rootValue;
  };
  var contextFn = exports.context || function (headers, secrets) {
    return Object.assign(
      {
        headers: headers,
      },
      secrets
    );
  };

  Object.keys(exports).forEach(function (key) {
    if ([
      'default',
      'schema',
      'context',
      'rootValue',
      'rootFunction',
    ].indexOf(key) === -1) {
      throw new Error('Unknown export: ' + key);
    }
  });

  if (!schema) {
    throw new Error('You need to export object with a field \`schema\` to run a Pad.');
  }

  function runGraphQL(schema, rootValue, context) {
    try {
      var query = context.body.query;
      var variables = context.body.variables;
      var operationName = context.body.operationName;

      var userContext = JSON.parse(context.secrets.userContext)
        .reduce(function (acc, next) {
          acc[next.key] = next.value;
          return acc;
        }, {});

      return Promise.all([
        Promise.resolve(schema),
        Promise.resolve(contextFn(context.headers, userContext)),
        Promise.resolve(rootFunction(context.headers, userContext)),
      ])
        .then(function (result) {
          var schema = result[0];
          var graphQLContext = result[1];
          var rootValue = result[2];
          return graphql.graphql(
            schema,
            query,
            rootValue,
            graphQLContext,
            variables,
            operationName
          );
        })
        .then(function (result) {
          return {
            ok: true,
            result: result,
          };
        })
        .catch(function (error) {
          return {
            ok: false,
            error: error,
          }
        });
    } catch (error) {
      return Promise.resolve({
        ok: false,
        error: error,
      });
    }
  }

  module.exports = function webtask(context, callback) {
    if (!context.body || !context.body.query) {
      callback('No query was provided in request body.');
    }
    runGraphQL(schema, rootValue, context).then(function (result) {
      if (result.ok) {
        callback(null, result.result);
      } else {
        callback(result.error);
      }
    });
  }
})();
`;
