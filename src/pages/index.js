import React from 'react';
import { createPage, createSwitch } from 'navi';
import cdpTypes from 'references/cdpTypes';
import watcher from '../watch';

import Landing from './Landing';
import Overview from './Overview';
import CDPPage from './CDP';
import { CDPTypeNotFound } from './NotFound';

const supportedCDPTypeSlugs = cdpTypes.map(({ slug }) => slug);

// detect network disconnets and infura fails
export default createSwitch({
  paths: {
    '/': createPage({
      title: 'Landing',
      content: <Landing />
    }),

    '/overview': async () => {
      await watcher.awaitInitialFetch();
      return createPage({
        title: 'Overview',
        content: <Overview />
      });
    },

    '/cdp/:type': async env => {
      const cdpTypeSlug = env.params.type;

      if (!supportedCDPTypeSlugs.includes(cdpTypeSlug))
        return createPage({
          title: 'CDP Type Not Found',
          content: <CDPTypeNotFound cdpTypeSlug={cdpTypeSlug} />
        });

      await watcher.awaitInitialFetch();
      return createPage({
        title: 'CDP',
        content: <CDPPage cdpTypeSlug={cdpTypeSlug} />
      });
    }
  }
});
