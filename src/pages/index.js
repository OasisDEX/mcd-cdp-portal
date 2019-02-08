import React from 'react';
import { createPage, createRedirect, createSwitch } from 'navi';
import cdpTypes from 'references/cdpTypes';

import { CDPTypeNotFound } from './NotFound';
import Landing from './Landing';
import Overview from './Overview';
import CDPPage from './CDP';

import { reInstantiateMaker } from 'maker';

import store from 'store';
import watcher from '../watch';
import config from 'references/config';
import { getTestchainDetails } from 'utils/testchain';
import localAddressConfig from 'references/addresses.json';
import { createCDPSystemModel } from 'reducers/network/system/model';

const { supportedNetworkIds, rpcUrls, defaultNetwork } = config;

// network  can come from, or live in, the following:
// 1. `the maker object`
// 2. `the multicall watcher`
// 3. `metamask`
// 4. `the url query param`, which can be seperated into:
//    - a testchainId
//    - a networkId

// memoized callback with a memory of 1

const DEFAULT_NETWORK_CONFIG = {
  rpcURL: rpcUrls[defaultNetwork],
  addresses: localAddressConfig[defaultNetwork]
};

function reCreateWatcher({ rpcURL, addresses }) {
  return watcher.reCreate([...createCDPSystemModel(addresses)], {
    rpcURL,
    multicallAddress: addresses.multicall
  });
}

let _lastRpcURL = '';
function rpcURLHasChanged(currentRpcURL) {
  const differenRpcURL = currentRpcURL !== _lastRpcURL;
  if (differenRpcURL) _lastRpcURL = currentRpcURL;
  return differenRpcURL;
}

async function getOrFetchNetworkDetails({ testchainId, networkId }) {
  // if there's a testchain id, we immediately try to connect to the ex_testchain instance
  if (testchainId !== undefined) {
    const { rpcURL, addresses, notFound } = await getTestchainDetails(
      testchainId
    );

    if (notFound) throw new Error(`Testchain id ${testchainId} not found`);
    return { rpcURL, addresses };

    // if not, we check for a network id
  } else {
    // if there is none, connect to the default network
    if (networkId === undefined) return DEFAULT_NETWORK_CONFIG;

    if (!supportedNetworkIds.includes(networkId))
      throw new Error(`Unsupported network id: ${networkId}`);

    return {
      rpcURL: rpcUrls[networkId],
      addresses: localAddressConfig[networkId]
    };
  }
}

function withNetworkConfigurations(getSuccessPage, getErrorPage) {
  let cachedIds = { testchainId: null, networkId: null };

  function idsHaveChanged({ testchainId = null, networkId = null } = {}) {
    if (testchainId !== cachedIds.testchainId) return true;
    if (networkId !== cachedIds.networkId) return true;
    return false;
  }

  return async env => {
    const { testchainId, networkId } = env.query;

    if (!idsHaveChanged({ testchainId, networkId })) return getSuccessPage(env);
    cachedIds = { testchainId, networkId };

    try {
      // testchainId or networkId
      const { rpcURL, addresses } = await getOrFetchNetworkDetails({
        testchainId,
        networkId
      });
      if (rpcURLHasChanged(rpcURL)) {
        store.dispatch({ type: 'CLEAR_ALL_CONTRACT_STATE' });
        await reInstantiateMaker({ rpcURL });
        await reCreateWatcher({ rpcURL, addresses });
      }
      return getSuccessPage(env);
    } catch (errMSG) {
      return getErrorPage(errMSG);
    }

    // on metamask switch

    // const makerNetworkId = maker.service('web3').networkId();
    // const newNetwork = !eq(networkId, makerNetworkId);
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

    '/overview': withNetworkConfigurations(
      () => {
        // success
        return createPage({
          title: 'Overview',
          content: <Overview />
        });
      },
      errMSG => {
        // error
        return createPage({
          title: 'Error',
          content: <div>{errMSG}</div>
        });
      }
    ),

    '/cdp/:type': withNetworkConfigurations(
      async env => {
        const cdpTypeSlug = env.params.type;

        // TODO: check what cdps the current active address has

        if (!supportedCDPTypeSlugs.includes(cdpTypeSlug))
          return createPage({
            title: 'CDP Type Not Found',
            content: <CDPTypeNotFound cdpTypeSlug={cdpTypeSlug} />
          });

        const address = env.query.address;
        if (address === undefined)
          return createRedirect(`/read-only/cdp/${cdpTypeSlug}`);

        return createPage({
          title: 'CDP',
          content: <CDPPage cdpTypeSlug={cdpTypeSlug} address={address} />
        });
      },
      errMSG => {
        return createPage({
          title: 'Error',
          content: <div>{errMSG}</div>
        });
      }
    ),

    // READ-ONLY --------------------------------------------------------------

    '/read-only': createRedirect(`/read-only/overview`),
    '/read-only/overview': withNetworkConfigurations(
      () => {
        return createPage({
          title: 'Overview Read-Only Mode',
          content: <Overview readOnly />
        });
      },
      errMSG => {
        return createPage({
          title: 'Error',
          content: <div>{errMSG}</div>
        });
      }
    ),

    '/read-only/cdp/:type': withNetworkConfigurations(
      async env => {
        const cdpTypeSlug = env.params.type;

        if (!supportedCDPTypeSlugs.includes(cdpTypeSlug))
          return createPage({
            title: 'CDP Type Not Found',
            content: <CDPTypeNotFound cdpTypeSlug={cdpTypeSlug} />
          });

        return createPage({
          title: 'Overview Read-Only Mode',
          content: <CDPPage cdpTypeSlug={cdpTypeSlug} readOnly />
        });
      },
      errMSG => {
        return createPage({
          title: 'Error',
          content: <div>{errMSG}</div>
        });
      }
    )
  }
});
