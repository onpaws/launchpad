/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.less';

const id = document.location.pathname.slice(1);
if (id === 'new') {
  ReactDOM.render(<App id={null} />, document.getElementById('root'));
} else if (id === 'list') {
  ReactDOM.render(
    <App id={null} type="list" />,
    document.getElementById('root'),
  );
} else if (id.length < 8 || !id.match('^[a-zA-Z0-9_]*$')) {
  document.location.replace('/new');
} else {
  ReactDOM.render(<App id={id} />, document.getElementById('root'));
}
