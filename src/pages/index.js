import React from 'react';
import { createPage, createRedirect, createSwitch } from 'navi';

import { Box } from '@makerdao/ui-components-core';
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
import { ModalProvider } from 'providers/ModalProvider';
import modals, { templates } from 'components/Modals';
import { userSnapInit } from 'utils/analytics';
import { getUnique } from 'utils/ui';
import ilkList from 'references/ilkList';

import BigNumber from 'bignumber.js';
import { createCurrencyRatio } from '@makerdao/currency';
import { USD } from '@makerdao/dai';

const { networkNames, defaultNetwork } = config;

const USING_MEDIAN_PRICE_FEEDS = false;

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

  let stateFetchPromise = Promise.resolve();
  if (watcherRecreated) {
    // all bets are off wrt what contract state in our store
    store.dispatch({ type: 'CLEAR_CONTRACT_STATE' });
    // do our best to attach state listeners to this new network
    stateFetchPromise = watcher.tap(() => {
      return [
        ...createCDPSystemModel(addresses),
        // cdpTypeModel.priceFeed(addresses)('WETH', { decimals: 18 }), // price feeds are by gem
        ...ilkList
          .map(({ key: ilk }) => [
            cdpTypeModel.rateData(addresses)(ilk),
            cdpTypeModel.liquidation(addresses)(ilk),
            cdpTypeModel.flipper(addresses)(ilk)
          ])
          .flat()
      ].filter(calldata => !isMissingContractAddress(calldata)); // (limited by the addresses we have)
    });
  }

  return { maker, addresses, stateFetchPromise };
}

// Any component that would like to change the network must replace url query params, re-running this function.
function withAuthenticatedNetwork(getPage, viewedAddress) {
  return async url => {
    try {
      // ensure our maker and watcher instances are connected to the correct network
      const { maker, stateFetchPromise, addresses } = await stageNetwork(
        url.query
      );
      const { pathname } = url;
      let connectedAddress = null;

      try {
        connectedAddress = maker.currentAddress();
      } catch (_) {
        // if no account is connected, or if maker.authenticate is still resolving, we render in read-only mode
      }

      const withMakerProvider = children => (
        // the canonical maker source

        <MakerHooksProvider maker={maker}>{children}</MakerHooksProvider>
      );

      const withModalProvider = children => (
        <ModalProvider modals={modals} templates={templates}>
          {children}
        </ModalProvider>
      );

      if (pathname === '/')
        return withMakerProvider(withModalProvider(getPage()));

      await maker.authenticate();
      await stateFetchPromise;

      // FIXME: #0.2.2
      const gemList = getUnique(ilkList, 'gem');
      for (let { gem, currency } of gemList) {
        const name = `PIP_${gem}`;
        const pipAddress = addresses[name];
        if (!pipAddress) continue;
        const ratio = createCurrencyRatio(USD, currency);
        let val, price;
        if (USING_MEDIAN_PRICE_FEEDS) {
          const storage = await maker
            .service('web3')
            ._web3.eth.getStorageAt(pipAddress, 3);
          val = storage.substr(34);
          price = ratio.wei(new BigNumber('0x' + val.toString()));
        } else {
          const pip = maker.service('smartContract').getContract(name);
          val = await pip.read();
          price = ratio.wei(val);
        }
        store.dispatch({ type: `${gem}.feedValueUSD`, value: price });
      }

      return withMakerProvider(
        withModalProvider(
          <PageLayout
            mobileNav={
              <MobileNav
                network={{
                  id: maker.service('web3').networkId()
                }}
                connectedAddress={connectedAddress}
                viewedAddress={viewedAddress}
              />
            }
            navbar={
              <Navbar
                connectedAddress={connectedAddress}
                viewedAddress={viewedAddress}
              />
            }
            sidebar={
              <Sidebar
                network={{
                  id: maker.service('web3').networkId()
                }}
                viewedAddress={viewedAddress}
              />
            }
            content={getPage()}
          />
        )
      );
    } catch (errMsg) {
      return (
        <Box m={8}>
          <pre>{errMsg.stack}</pre>
        </Box>
      );
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

    '/owner/:viewedAddress': url => {
      if (networkIsUndefined(url)) return createDefaultNetworkRedirect(url);

      const { viewedAddress } = url.params;

      return createPage({
        title: 'Overview',
        getContent: withAuthenticatedNetwork(
          () => <Overview viewedAddress={viewedAddress} />,
          viewedAddress
        )
      });
    },

    '/:cdpId': url => {
      if (networkIsUndefined(url)) return createDefaultNetworkRedirect(url);
      const { cdpId } = url.params;

      return createPage({
        title: 'CDP',
        getContent: withAuthenticatedNetwork(() => <CDPPage cdpId={cdpId} />)
      });
    }
  }
});

function networkIsUndefined(url) {
  return url.query.network === undefined && url.query.testchainId === undefined;
}

function createDefaultNetworkRedirect(url) {
  const { pathname } = url;

  return createRedirect(
    `${pathname === '/' ? '' : pathname}/?network=${
      networkNames[defaultNetwork]
    }`
  );
}
