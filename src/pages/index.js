import React from 'react';
import { createPage, createRedirect, createSwitch } from 'navi';
import { Grid } from '@makerdao/ui-components';

import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import Landing from './Landing';
import Overview from './Overview';
import CDPPage from './CDP';

import store from 'store';
import { getOrRecreateWatcher } from '../watch';
import { getOrReinstantiateMaker } from '../maker';
import { getOrFetchNetworkDetails } from 'utils/network';
import { isMissingContractAddress } from 'utils/ethereum';

import * as cdpTypeModel from 'reducers/network/cdpTypes/model';
import { createCDPSystemModel } from 'reducers/network/system/model';
import MakerHooksProvider from 'components/context/MakerHooksProvider';
import config from 'references/config';

const { networkNames, defaultNetwork } = config;

async function stageNetwork(env) {
  // theses url params deteremine the network
  const { testchainId, network } = env.query;

  // memoized on networkId-testchainId combination, no limit
  const { rpcUrl, addresses } = await getOrFetchNetworkDetails({
    network,
    testchainId
  });

  // memoized on rpcUrl, memory of 1
  const { maker } = await getOrReinstantiateMaker({ rpcUrl });
  const {
    watcher,
    reinstantiated: watcherReinstantiated
  } = await getOrRecreateWatcher({
    rpcUrl,
    addresses
  });

  let stateFetchPromise = Promise.resolve();
  if (watcherReinstantiated) {
    // all bets are off wrt what contract state is in our store
    store.dispatch({ type: 'CLEAR_CONTRACT_STATE' });
    // do our best to attach state listeners to this new network
    stateFetchPromise = watcher.tap(() => {
      return [
        ...createCDPSystemModel(addresses),
        cdpTypeModel.priceFeed(addresses)('ETH', { decimals: 18 }),
        cdpTypeModel.priceFeed(addresses)('REP', { decimals: 18 }),
        cdpTypeModel.priceFeed(addresses)('BTC', { decimals: 18 }),
        cdpTypeModel.priceFeed(addresses)('DGX', { decimals: 9 })
      ].filter(calldata => !isMissingContractAddress(calldata));
    });
  }

  return { maker, stateFetchPromise };
}

// If any components would like to change which network the app is connected to, they must replace url params,
// re-running this function. All expensive operations should be memoized.
function withNetworkAuthenticated(getPage) {
  return async env => {
    try {
      // ensure our maker and watcher instances are connected to the correct network
      const { maker, stateFetchPromise } = await stageNetwork(env);

      const { pathname } = env;

      let connectedAddress = null;
      try {
        connectedAddress = maker.currentAddress();
      } catch (_) {
        // no connected account, we'll render read-only mode
      }

      const getPageWithMaker = () => (
        // the canonical maker source
        <MakerHooksProvider maker={maker}>{getPage()}</MakerHooksProvider>
      );

      if (pathname === '/') return getPageWithMaker();

      await maker.authenticate();
      await stateFetchPromise;
      return (
        <Grid
          gridTemplateColumns="80px 1fr 315px"
          gridTemplateAreas="'navbar view sidebar'"
          width="100%"
        >
          <Navbar />
          {getPageWithMaker()}
          <Sidebar
            network={{
              id: maker.service('web3').networkId(),
              swappable: false
            }}
            address={connectedAddress}
          />
        </Grid>
      );
    } catch (errMsg) {
      return <div>{errMsg.toString()}</div>;
    }
  };
}

export default createSwitch({
  paths: {
    '/': env => {
      if (networkIsUndefined(env)) return createDefaultNetworkRedirect(env);

      return createPage({
        title: 'Landing',
        getContent: withNetworkAuthenticated(() => <Landing />)
      });
    },

    '/overview': env => {
      if (networkIsUndefined(env)) return createDefaultNetworkRedirect(env);

      return createPage({
        title: 'Overview',
        getContent: withNetworkAuthenticated(() => <Overview />)
      });
    },

    '/cdp/:type': env => {
      if (networkIsUndefined(env)) return createDefaultNetworkRedirect(env);
      const cdpTypeSlug = env.params.type;

      return createPage({
        title: 'CDP',
        getContent: withNetworkAuthenticated(() => (
          <CDPPage cdpTypeSlug={cdpTypeSlug} />
        ))
      });
    }
  }
});

function networkIsUndefined(env) {
  return env.query.network === undefined && env.query.testchainId === undefined;
}

function createDefaultNetworkRedirect(env) {
  const { address } = env.query;
  const { pathname } = env;
  const addressQuery = address === undefined ? '?' : `?address=${address}&`;

  return createRedirect(
    `${pathname === '/' ? '' : pathname}/${addressQuery}network=${
      networkNames[defaultNetwork]
    }`
  );
}
