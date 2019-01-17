import React from 'react';
import ReactDOM from 'react-dom';
import watcher from './watch';
import maker from './maker';
import { createBrowserNavigation } from 'navi';

import '@makerdao/ui-components/dist/styles/global.css';
import './global.css';

import pages from './pages';
import App from './App';

(async () => {
  const navigation = createBrowserNavigation({ pages });

  watcher.startWatch();

  // It's pretty annoying to wait for this before rendering
  // since we really only need to block transactions before authentication
  // but here it stays for now
  await maker.authenticate();

  // Wait until async content is ready (or has failed).
  await navigation.steady();

  ReactDOM.render(
    <App navigation={navigation} />,
    document.getElementById('root')
  );
})();
