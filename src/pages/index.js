import React from 'react';
import { createPage, createRedirect, createSwitch } from 'navi';
import cdpTypes from 'references/cdpTypes';

import { CDPTypeNotFound } from './NotFound';
import Landing from './Landing';
import Overview from './Overview';
import CDPPage from './CDP';

import maker, {
  reInstantiateMaker,
  reInstantiateMakerWithTestchain,
  getLastTestchainId
} from 'maker';

import store from 'store';
import watcher from '../watch';

function eq(a, b) {
  return parseInt(a, 10) === parseInt(b, 10);
}

const SUPPORTED_NETWORK_IDS = ['42'];

// this function must be idempotent except wrt env.query
function withStagedNetwork(getSuccessPage, getErrorPage) {
  return async env => {
    await maker.authenticate();

    const { testchainId } = env.query;
    const newTestchain =
      testchainId !== undefined && !eq(testchainId, getLastTestchainId()); // we should be checking the store

    if (newTestchain) {
      // this testchain is different from the one whose state we have cached
      store.dispatch({ type: 'CLEAR_ALL_CONTRACT_STATE' });

      const networkDetails = await reInstantiateMakerWithTestchain({
        testchainId
      });

      if (networkDetails.notFound)
        return getErrorPage('FAILED TO GET TESTCHAIN CONFIG');

      const { rpcURL, addresses } = networkDetails;

      await watcher.reCreate([], {
        rpcURL,
        multicallAddress: addresses.multicall
      });
    }

    // if we're connecting to a testchain, don't worry about anything else
    if (testchainId !== undefined) return getSuccessPage(env);

    const { networkId } = env.query;
    if (!SUPPORTED_NETWORK_IDS.includes(networkId))
      return getErrorPage(`UNSUPPORTED NETWORK ID ${networkId}`);
    const makerNetworkId = maker.service('web3').networkId();
    const newNetwork = !eq(networkId, makerNetworkId);

    if (newNetwork) {
      // this network is different from the one whose state we have cached
      store.dispatch({ type: 'CLEAR_ALL_CONTRACT_STATE' });
      const networkDetails = await reInstantiateMaker({ networkId });

      if (networkDetails.notFound)
        return getErrorPage(`UNSUPPORTED NETWORK ID ${networkId}`);

      const { rpcURL, addresses } = networkDetails;

      await watcher.reCreate([], {
        rpcURL,
        multicallAddress: addresses.multicall
      });
    }

    return getSuccessPage(env);
  };
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

    '/overview': withStagedNetwork(
      () => {
        return createPage({
          title: 'Overview',
          content: <Overview />
        });
      },
      errMSG => {
        return createPage({
          title: 'Error',
          content: <div>{errMSG}</div>
        });
      }
    ),

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
