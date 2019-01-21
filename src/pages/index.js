import React from 'react';
import { createPage, createRedirect, createSwitch } from 'navi';
import cdpTypes from 'references/cdpTypes';
import watcher from '../watch';

import { CDPTypeNotFound } from './NotFound';
import Landing from './Landing';
import Overview from './Overview';
import CDPPage from './CDP';

import maker from '../maker';

const supportedCDPTypeSlugs = cdpTypes
  .filter(({ hidden }) => !hidden)
  .map(({ slug }) => slug);

export default createSwitch({
  paths: {
    '/': createPage({
      title: 'Landing',
      content: <Landing />
    }),

    '/overview': async () => {
      await maker.authenticate();
      await watcher.awaitInitialFetch();
      return createPage({
        title: 'Overview',
        content: <Overview />
      });
    },

    '/cdp/:type': async env => {
      const cdpTypeSlug = env.params.type;

      // TODO: check what cdps the current active address has

      if (!supportedCDPTypeSlugs.includes(cdpTypeSlug))
        return createPage({
          title: 'CDP Type Not Found',
          content: <CDPTypeNotFound cdpTypeSlug={cdpTypeSlug} />
        });

      const address = env.query.address;
      await watcher.awaitInitialFetch();
      if (address === undefined)
        return createRedirect(`/read-only/cdp/${cdpTypeSlug}`);

      await maker.authenticate();
      return createPage({
        title: 'CDP',
        content: <CDPPage cdpTypeSlug={cdpTypeSlug} address={address} />
      });
    },

    '/read-only/overview': createPage({
      title: 'Overview Read-Only Mode',
      content: <Overview readOnly />
    }),

    '/read-only/cdp/:type': async env => {
      const cdpTypeSlug = env.params.type;

      if (!supportedCDPTypeSlugs.includes(cdpTypeSlug))
        return createPage({
          title: 'CDP Type Not Found',
          content: <CDPTypeNotFound cdpTypeSlug={cdpTypeSlug} />
        });

      await maker.authenticate();
      await watcher.awaitInitialFetch();
      return createPage({
        title: 'Overview Read-Only Mode',
        content: <CDPPage cdpTypeSlug={cdpTypeSlug} readOnly />
      });
    },

    '/sandbox/overview': async env => {
      // const providerConfigURL = env.params.config;
      // const _providerConfig = await fetch(providerConfigURL);
      // const providerConfig = await _providerConfig.json();
      // eg https://cdp.makerdao.com/sandbox/overview?config=https://111.13.5.6:5001/
      return createPage({
        title: 'Overview Sandbox Mode',
        content: <div>Move along, nothing to see here</div>
      });
    }
  }
});
