import React from 'react';
import ReactDOM from 'react-dom';
import watcher from './watch';
import maker from './maker';
import { createBrowserNavigation } from 'navi';

import '@makerdao/ui-components/dist/styles/global.css';
import './global.css';

import pages from './pages';
import App from './App';

export const navigation = createBrowserNavigation({ pages });

(async () => {
  // start watching for ethereum state diffs
  watcher.startWatch();

  // for debugging
  window.maker = maker;

  maker.authenticate();

  // prepare routes
  await navigation.steady();

  ReactDOM.render(
    <App navigation={navigation} />,
    document.getElementById('root')
  );
})();
