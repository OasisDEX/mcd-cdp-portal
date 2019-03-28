import React from 'react';
import ReactDOM from 'react-dom';

import watcher from './watch';
import lang from './languages';

import '@makerdao/ui-components-core/dist/styles/global.css';
import './global.css';

import App from './App';

lang.setLanguage('en');

// start watching for ethereum state changes
watcher.start();

ReactDOM.render(<App />, document.getElementById('root'));
