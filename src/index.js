import React from 'react';
import ReactDOM from 'react-dom';

import watcher from './watch';
import { getOrReinstantiateMaker } from './maker';
import lang from './languages';

import { createBrowserNavigation } from 'navi';
import config from 'references/config';
import '@makerdao/ui-components/dist/styles/global.css';
import './global.css';

import pages from './pages';
import App from './App';
import { mixpanelInit, gaInit } from 'utils/analytics';

const { rpcUrls, defaultNetwork } = config;

export const navigation = createBrowserNavigation({ pages });

(async () => {
  lang.setLanguage('en');

  // start watching for ethereum state changes
  watcher.start();

  getOrReinstantiateMaker({ rpcUrl: rpcUrls[defaultNetwork] });

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
