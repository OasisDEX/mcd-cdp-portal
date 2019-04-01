import React from 'react';
import ReactDOM from 'react-dom';

import lang from './languages';

import '@makerdao/ui-components-core/dist/styles/global.css';
import './global.css';

import App from './App';

lang.setLanguage('en');

ReactDOM.render(<App />, document.getElementById('root'));
