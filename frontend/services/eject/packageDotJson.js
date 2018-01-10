/* @flow */

// replace: name, description, dependencies

export default `{
  "name": "{{name}}",
  "version": "0.1.0",
  "description": "{{description}}",
  "main": "./src/server.js",
  "scripts": {
    "start": "nodemon ./src/server.js --exec babel-node -e js",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "author": "",
  "devDependencies": {
    "babel-cli": "^6.24.0",
    "babel-plugin-transform-async-generator-functions": "^6.24.1",
    "babel-plugin-transform-object-rest-spread": "^6.23.0",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.6.1",
    "nodemon": "^1.11.0"
  },
  "dependencies": {
    "body-parser": "^1.17.1",
    "express": "^4.15.2",
{{dependencies}}
    "apollo-server-express": "^1.2.0"
  }
}`;
