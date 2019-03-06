import React from 'react';
import { createPage, createRedirect, createSwitch } from 'navi';

import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import PageLayout from 'layouts/PageLayout';
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
import MakerHooksProvider from 'providers/MakerHooksProvider';
import config from 'references/config';
import MobileNav from 'components/MobileNav';

const { networkNames, defaultNetwork } = config;

async function stageNetwork({ testchainId, network }) {
  // network will be ignored if testchainId is present

  // memoized on network-testchainId combination, no memory limit
  const { rpcUrl, addresses } = await getOrFetchNetworkDetails({
    network,
    testchainId
  });

  // reinstantiated if rpcUrl has changed
  const { maker } = await getOrReinstantiateMaker({ rpcUrl });
  const { watcher, recreated: watcherRecreated } = await getOrRecreateWatcher({
    rpcUrl,
    addresses
  });

  let stateFetchPromise = Promise.resolve();
  if (watcherRecreated) {
    // all bets are off wrt what contract state in our store
    store.dispatch({ type: 'CLEAR_CONTRACT_STATE' });
    // do our best to attach state listeners to this new network
    stateFetchPromise = watcher.tap(() => {
      return [
        ...createCDPSystemModel(addresses),
        cdpTypeModel.priceFeed(addresses)('ETH', { decimals: 18 }),
        cdpTypeModel.priceFeed(addresses)('REP', { decimals: 18 }),
        cdpTypeModel.priceFeed(addresses)('BTC', { decimals: 18 }),
        cdpTypeModel.priceFeed(addresses)('DGX', { decimals: 9 })
      ].filter(calldata => !isMissingContractAddress(calldata)); // (limited by the addresses we have)
    });
  }

  return { maker, stateFetchPromise };
}

// Any component that would like to change the network must replace url query params, re-running this function.
function withAuthenticatedNetwork(getPage) {
  return async url => {
    try {
      // ensure our maker and watcher instances are connected to the correct network
      const { maker, stateFetchPromise } = await stageNetwork(url.query);

      const { pathname } = url;

      let connectedAddress = null;
      try {
        connectedAddress = maker.currentAddress();
      } catch (_) {
        // if no account is connected, or if maker.authenticate is still resolving, we render in read-only mode
      }

      const getPageWithMakerProvider = () => (
        // the canonical maker source
        <MakerHooksProvider maker={maker}>{getPage()}</MakerHooksProvider>
      );

      if (pathname === '/') return getPageWithMakerProvider();

      await maker.authenticate();
      await stateFetchPromise;
      return (
        <PageLayout
          mobileNav={
            <MobileNav
              network={{
                id: maker.service('web3').networkId(),
                swappable: false
              }}
              address={connectedAddress}
            />
          }
          navbar={<Navbar />}
          sidebar={
            <Sidebar
              network={{
                id: maker.service('web3').networkId(),
                swappable: false
              }}
              address={connectedAddress}
            />
          }
          content={getPageWithMakerProvider()}
        />
      );
    } catch (errMsg) {
      return <div>{errMsg.toString()}</div>;
    }
  };
}

export default createSwitch({
  paths: {
    '/': url => {
      if (networkIsUndefined(url)) return createDefaultNetworkRedirect(url);

      return createPage({
        title: 'Landing',
        getContent: withAuthenticatedNetwork(() => <Landing />)
      });
    },

    '/overview': url => {
      if (networkIsUndefined(url)) return createDefaultNetworkRedirect(url);

      return createPage({
        title: 'Overview',
        getContent: withAuthenticatedNetwork(() => <Overview />)
      });
    },

    '/cdp/:type': url => {
      if (networkIsUndefined(url)) return createDefaultNetworkRedirect(url);
      const cdpTypeSlug = url.params.type;

      return createPage({
        title: 'CDP',
        getContent: withAuthenticatedNetwork(() => (
          <CDPPage cdpTypeSlug={cdpTypeSlug} />
        ))
      });
    }
  }
});

function networkIsUndefined(url) {
  return url.query.network === undefined && url.query.testchainId === undefined;
}

function createDefaultNetworkRedirect(url) {
  const { address } = url.query;
  const { pathname } = url;
  const addressQuery = address === undefined ? '?' : `?address=${address}&`;

  return createRedirect(
    `${pathname === '/' ? '' : pathname}/${addressQuery}network=${
      networkNames[defaultNetwork]
    }`
  );
}
