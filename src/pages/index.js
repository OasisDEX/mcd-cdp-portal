import React from 'react';
import { createPage, createRedirect, createSwitch } from 'navi';

import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import PageLayout from 'layouts/PageLayout';
import Landing from './Landing';
import Overview from './Overview';
import CDPPage from './CDP';

import store from 'store';
import { NETWORK_CHANGED, ADDRESS_CHANGED } from '../reducers/app';
import { getOrRecreateWatcher } from '../watch';
import { getOrReinstantiateMaker } from '../maker';
import { getOrFetchNetworkDetails } from 'utils/network';

import MakerHooksProvider from 'providers/MakerHooksProvider';
import config from 'references/config';
import MobileNav from 'components/MobileNav';
import { ModalProvider } from 'providers/ModalProvider';
import modals from 'components/Modals';
import { userSnapInit } from 'utils/analytics';

const { networkNames, defaultNetwork } = config;

let lastRpcUrl = null;

async function stageNetwork({ network, testchainId }) {
  if (network !== 'mainnet') {
    userSnapInit();
  }

  // network will be ignored if testchainId is present
  const { rpcUrl, addresses } = await getOrFetchNetworkDetails({
    network,
    testchainId
  });

  // ensure our maker and watcher instances are connected to the correct network
  const { maker } = await getOrReinstantiateMaker({ rpcUrl, addresses });
  const { watcher } = await getOrRecreateWatcher({ rpcUrl, addresses });

  if (rpcUrl !== lastRpcUrl) {
    lastRpcUrl = rpcUrl;
    store.dispatch({ type: NETWORK_CHANGED, payload: { rpcUrl, addresses } });
  }

  return { maker, watcher };
}

// Any component that would like to change the network must replace url query params, re-running this function.
function withAuthenticatedNetwork(getPage) {
  return async url => {
    try {
      const { query, pathname } = url;

      const { maker } = await stageNetwork(query);

      let connectedAddress = null;
      try {
        connectedAddress = maker.currentAddress();
      } catch (_) {
        connectedAddress = query.address;
      }

      maker
        .service('proxy')
        .getProxyAddress(connectedAddress)
        .then(proxyAddress => {
          store.dispatch({
            type: ADDRESS_CHANGED,
            payload: { address: connectedAddress, proxyAddress: proxyAddress }
          });
        });

      const withMakerProvider = children => (
        // the canonical maker source
        <MakerHooksProvider maker={maker}>{children}</MakerHooksProvider>
      );

      if (pathname === '/')
        return withMakerProvider(
          <ModalProvider modals={modals}>{getPage()}</ModalProvider>
        );

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
                currentAccount={connectedAddress}
                address={connectedAddress}
              />
            }
            content={getPage()}
          />
        </ModalProvider>
      );
    } catch (err) {
      console.log(err);
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
