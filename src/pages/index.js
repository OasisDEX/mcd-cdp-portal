import React from 'react';
import { createPage, createRedirect, createSwitch } from 'navi';
import cdpTypes from 'references/cdpTypes';

import { CDPTypeNotFound } from './NotFound';
import Landing from './Landing';
import Overview from './Overview';
import CDPPage from './CDP';

import maker, { reInstantiateMaker } from 'maker';
import store from 'store';
import watcher from '../watch';

const ID_TO_NETWORK_NAME = {
  1: 'mainnet',
  42: 'kovan'
};

const RPC_URLS = {
  1: 'https://kovan.infura.io/',
  42: 'https://infura.io/'
};

const ADDRESSES = {
  1: {},
  42: {}
};

function getOrFetchAddresses(networkID) {
  return ADDRESSES[networkID];
}

const CDPS = [];

function getUserCDPs(address) {
  return CDPS;
}

function newAccountModel(address, cdps) {
  return [];
}

function determineNetwork() {
  const networkState = { readOnly: true, network: { rpcURL: '', name: '' } };

  return { ...networkState };
}

const supportedCDPTypeSlugs = cdpTypes
  .filter(({ hidden }) => !hidden)
  .map(({ slug }) => slug);

export default createSwitch({
  paths: {
    '/': createPage({
      title: 'Landing',
      content: <Landing />
    }),

    '/overview': async env => {
      const { networkId } = env.context;
      const { address } = env.query;

      // user can

      await maker.authenticate();

      if (networkId === undefined) throw new Error('');

      const networkName = ID_TO_NETWORK_NAME[networkId];
      const rpcURL = RPC_URLS[networkId];

      const userCDPs = getUserCDPs(address);
      const currentNetworkId = maker.service('web3').networkId();

      // the network is different from what our maker instance thinks it is
      if (networkId !== currentNetworkId) {
        // we're asking context to keep track of the fact that our network has been spent

        // clear network state from the store
        store.dispatch({ type: 'CLEAR_ALL_CONTRACT_STATE' });

        const contractAddresses = getOrFetchAddresses(networkId);

        const authWaiter = reInstantiateMaker(rpcURL);
        const fetchWaiter = watcher.setConfig(() => ({
          multicallAddress: contractAddresses.multicall,
          rpcURL
        }));

        await Promise.all([fetchWaiter, authWaiter]);
      } else await watcher.awaitInitialFetch();

      try {
        const account = maker.currentAccount();
        if (store.getState().user.address !== account.address) {
          await watcher.tap(model => {
            return model.concat(newAccountModel(account.address, userCDPs));
          });
        }
        return createPage({
          title: 'Overview',
          content: (
            <Overview
              // readOnly={readOnly}
              // useNetwork={useNetwork}
              networkName={networkName}
              rpcURL={rpcURL}
            />
          )
        });
      } catch (_) {
        return createRedirect(`/read-only/overview`);
      }

      // const useNetwork = createNetworkHook();
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

    // READ-ONLY --------------------------------------------------------------

    '/read-only': createRedirect(`/read-only/overview`),
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
    }
  }
});
