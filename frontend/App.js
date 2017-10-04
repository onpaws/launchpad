/* @flow */

import React, { Component } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';
import PadContainer from './PadContainer';
import ListContainer from './ListContainer';

const networkInterface = createNetworkInterface({
  uri: process.env.REACT_APP_LAUNCHPAD_API_URL,
});

networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }
      const token = localStorage.getItem('LAUNCHPAD_TOKEN');
      if (token) {
        req.options.headers['authorization'] = `Bearer: ${token}`;
      }
      next();
    },
  },
]);

const apolloClient = new ApolloClient({
  networkInterface,
});

export default class App extends Component {
  props: {|
    id: ?string,
    type?: 'pad' | 'list',
  |};

  defaultProps = {
    type: 'pad',
  };

  renderContainer() {
    if (this.props.type === 'list') {
      return <ListContainer />;
    } else {
      return <PadContainer id={this.props.id} />;
    }
  }

  render() {
    return (
      <ApolloProvider client={apolloClient}>
        {this.renderContainer()}
      </ApolloProvider>
    );
  }
}
