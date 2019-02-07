import React from 'react';
import ReactDOM from 'react-dom';

import watcher from './watch';
import maker from './maker';
import lang from './languages';

import { createBrowserNavigation } from 'navi';
import '@makerdao/ui-components/dist/styles/global.css';
import './global.css';

import pages from './pages';
import App from './App';
import { mixpanelInit, gaInit } from 'utils/analytics';

export const navigation = createBrowserNavigation({ pages });

(async () => {
  lang.setLanguage('en');

  // start watching for ethereum state diffs
  watcher.start();

  // for debugging
  window.maker = maker;

  maker.authenticate();

  // prepare routes
  navigation.steady();

  // start GA and mixpanel tracking
  gaInit(navigation);
  mixpanelInit(navigation);

  ReactDOM.render(
    <App navigation={navigation} />,
    document.getElementById('root')
  );
})();
