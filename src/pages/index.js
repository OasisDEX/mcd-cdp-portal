import React from 'react';
import { createPage, createSwitch } from 'navi';
import styled from 'styled-components';
import cdpTypes from 'references/cdpTypes';
import { Grid } from '@makerdao/ui-components';
import watcher from '../watch';

import { CDPTypeNotFound } from './NotFound';
import Landing from './Landing';
import Overview from './Overview';
import CDPPage from './CDP';

import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import cdpTypesConfig from 'references/cdpTypes';
import maker from '../maker';

const View = styled.div`
  padding: 55px 32px;
  background: #f6f8f9;
`;

const supportedCDPTypeSlugs = cdpTypes.map(({ slug }) => slug);

export default createSwitch({
  paths: {
    '/': createPage({
      title: 'Landing',
      content: <Landing />
    }),

    '/overview': async env => {
      await maker.authenticate();
      await watcher.awaitInitialFetch();
      return createPage({
        title: 'Overview',
        content: (
          <Grid
            gridTemplateColumns="80px 1fr 315px"
            gridTemplateAreas="'navbar view sidebar'"
            width="100%"
          >
            <Navbar cdps={cdpTypesConfig} />
            <View>
              <Overview />
            </View>
            <Sidebar networkName="kovan" networkDisplayName="Kovan Testnet" />
          </Grid>
        )
      });
    },

    '/cdp/:type': async env => {
      const cdpTypeSlug = env.params.type;

      if (!supportedCDPTypeSlugs.includes(cdpTypeSlug))
        return createPage({
          title: 'CDP Type Not Found',
          content: <CDPTypeNotFound cdpTypeSlug={cdpTypeSlug} />
        });

      await maker.authenticate();
      await watcher.awaitInitialFetch();
      return createPage({
        title: 'CDP',
        content: (
          <Grid
            gridTemplateColumns="80px 1fr 315px"
            gridTemplateAreas="'navbar view sidebar'"
            width="100%"
          >
            <Navbar cdps={cdpTypesConfig} />
            <View>
              <CDPPage cdpTypeSlug={cdpTypeSlug} />
            </View>
            <Sidebar networkName="kovan" networkDisplayName="Kovan Testnet" />
          </Grid>
        )
      });
    },

    '/read-only/overview': createPage({
      title: 'Overview Read-Only Mode',
      content: <div>Move along, nothing to see here</div>
    }),

    '/sandbox/overview': createPage({
      // eg https://cdp.makerdao.com/sandbox/overview?rpcURL=https://111.13.5.6:5000/&config=https://111.13.5.6:5001/
      title: 'Overview Sandbox Mode',
      content: <div>Move along, nothing to see here</div>
    })
  }
});
