import React from 'react';
import ReactDOM from 'react-dom';

import '../assets/images/favicon.jpg';

import App from './App';

ReactDOM.render(
  React.createElement(App, {}, null),
  document.getElementById('app')
);
