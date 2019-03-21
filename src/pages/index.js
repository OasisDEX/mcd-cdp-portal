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

import * as accountWatcherCalls from 'reducers/network/account/calls';
import { createIlkWatcherCalls } from 'reducers/network/ilks/calls';
import { createSystemWatcherCalls } from 'reducers/network/system/calls';
import MakerHooksProvider from 'providers/MakerHooksProvider';
import ilks from 'references/ilks';
import config from 'references/config';
import MobileNav from 'components/MobileNav';
import { ModalProvider } from 'providers/ModalProvider';
import modals from 'components/Modals';
import { userSnapInit } from 'utils/analytics';

const { networkNames, defaultNetwork } = config;

function tapTokenAllowanceCalls(watcher, addresses, address, proxy) {
  watcher.tap(calls => [
    // Remove any existing token balance calls
    ...calls.filter(calldata => calldata.type !== 'token_allowance'),
    // Add token allowance calls for this wallet address and proxy
    ...store
      .getState()
      .network.account.tokens.map(({ key: gem }) =>
        accountWatcherCalls.tokenAllowance(addresses)(gem, address, proxy)
      )
  ]);
}

let lastConnectedAddress = null;
let lastProxyAddress = null;

async function stageNetwork({ testchainId, network }) {
  // network will be ignored if testchainId is present

  if (network !== 'mainnet') {
    userSnapInit();
  }
  // memoized on network-testchainId combination, no memory limit
  const { rpcUrl, addresses } = await getOrFetchNetworkDetails({
    network,
    testchainId
  });

  // reinstantiated if rpcUrl has changed
  const {
    maker,
    reinstantiated: makerReinstantiated
  } = await getOrReinstantiateMaker({ rpcUrl, addresses });
  if (makerReinstantiated)
    store.dispatch({ type: 'addresses/set', payload: { addresses } });

  const { watcher, recreated: watcherRecreated } = await getOrRecreateWatcher({
    rpcUrl,
    addresses
  });

  if (makerReinstantiated) {
    store.dispatch({ type: 'addresses/set', payload: { addresses } });
    maker.on('dsproxy/BUILD', obj => {
      const proxyAddress = obj.payload.address;
      const connectedAddress = maker.currentAddress();
      console.debug(`New DSProxy created: ${proxyAddress}.`);
      tapTokenAllowanceCalls(
        watcher,
        addresses,
        connectedAddress,
        proxyAddress
      );
    });
  }

  let stateFetchPromise = Promise.resolve();
  if (watcherRecreated) {
    // all bets are off wrt what contract state in our store
    store.dispatch({ type: 'CLEAR_CONTRACT_STATE' });
    // do our best to attach state listeners to this new network
    stateFetchPromise = watcher.tap(() => {
      return [
        // add watcher calls for system variables
        ...createSystemWatcherCalls(addresses),
        // add watcher calls for the ilks we have
        ...ilks.reduce(
          (acc, { key }) => (
            // eslint-disable-next-line
            acc.push(...createIlkWatcherCalls(addresses, key)), acc
          ),
          []
        )
      ].filter(calldata => !isMissingContractAddress(calldata)); // (limited by the addresses we have)
    });
  }

  return { maker, watcher, addresses, stateFetchPromise };
}

// Any component that would like to change the network must replace url query params, re-running this function.
function withAuthenticatedNetwork(getPage) {
  return async url => {
    try {
      // ensure our maker and watcher instances are connected to the correct network
      const {
        maker,
        watcher,
        addresses,
        stateFetchPromise
      } = await stageNetwork(url.query);
      const { pathname } = url;
      let connectedAddress = null;

      try {
        connectedAddress = maker.currentAddress();
        const proxyAddress = await maker.service('proxy').currentProxy();
        if (connectedAddress !== lastConnectedAddress) {
          console.debug(`Active address changed to ${connectedAddress}.`);
          lastConnectedAddress = connectedAddress;
          watcher.tap(calls => [
            // Remove any existing token balance calls
            ...calls.filter(calldata => calldata.type !== 'token_balance'),
            // Add token balance calls for this wallet address
            ...store
              .getState()
              .network.account.tokens.map(({ key: gem }) =>
                accountWatcherCalls.tokenBalance(addresses)(
                  gem,
                  connectedAddress
                )
              )
          ]);
        }
        if (proxyAddress !== lastProxyAddress) {
          console.debug(`DSProxy address changed to ${proxyAddress}.`);
          lastProxyAddress = proxyAddress;
          tapTokenAllowanceCalls(
            watcher,
            addresses,
            connectedAddress,
            proxyAddress
          );
        }
      } catch (_) {
        // if no account is connected, or if maker.authenticate is still resolving, we render in read-only mode
      }

      const withMakerProvider = children => (
        // the canonical maker source
        <MakerHooksProvider maker={maker}>{children}</MakerHooksProvider>
      );

      if (pathname === '/')
        return withMakerProvider(
          <ModalProvider modals={modals}>{getPage()}</ModalProvider>
        );

      await maker.authenticate();
      await stateFetchPromise;

      return withMakerProvider(
        <ModalProvider modals={modals}>
          <PageLayout
            mobileNav={
              <MobileNav
                network={{
                  id: maker.service('web3').networkId()
                }}
                address={connectedAddress}
              />
            }
            navbar={<Navbar address={connectedAddress} />}
            sidebar={
              <Sidebar
                network={{
                  id: maker.service('web3').networkId()
                }}
                currentAccount={
                  connectedAddress ? maker.currentAccount() : null
                }
                address={connectedAddress}
              />
            }
            content={getPage()}
          />
        </ModalProvider>
      );
    } catch (err) {
      return <div>{err.toString()}</div>;
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
