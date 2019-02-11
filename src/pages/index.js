import React from 'react';
import { createPage, createSwitch } from 'navi';
import cdpTypes from 'references/cdpTypes';

import { CDPTypeNotFound } from './NotFound';
import Landing from './Landing';
import Overview from './Overview';
import CDPPage from './CDP';

import store from 'store';
import { getOrRecreateWatcher } from '../watch';
import config from 'references/config';
import localAddressConfig from 'references/addresses.json';
import { getOrReinstantiateMaker } from '../maker';
import { getTestchainDetails } from 'utils/network';
import MakerHooksProvider from 'components/context/MakerHooksProvider';

const { supportedNetworkIds, rpcUrls, defaultNetwork } = config;

// network  can come from, or live in, the following:
// 1. `the maker object`
// 2. `the multicall watcher`
// 3. `metamask`
// 4. `the url query param`, which can be seperated into:
//    - a testchainId
//    - a networkId

const DEFAULT_NETWORK_CONFIG = {
  rpcUrl: rpcUrls[defaultNetwork],
  addresses: localAddressConfig[defaultNetwork]
};

// capture all contexts
// release all contexts

const _cache = { networkIds: [], testchainIds: [] };
export async function getOrFetchNetworkDetails({ networkId, testchainId }) {
  // is this a pair we've seen before?
  // if (_cache.networkId !== networkId ) return;
  // if there's a testchain id, we immediately attempt to connect to its ex testchain instance
  if (testchainId !== undefined) {
    const { rpcUrl, addresses, notFound } = await getTestchainDetails(
      testchainId
    );

    if (notFound) throw new Error(`Testchain id ${testchainId} not found`);
    return { rpcUrl, addresses };
  } else {
    // if the network can't be determined from the url, we connect to defaults
    if (networkId === undefined) return DEFAULT_NETWORK_CONFIG;

    if (!supportedNetworkIds.includes(networkId))
      throw new Error(`Unsupported network id: ${networkId}`);

    return {
      rpcUrl: rpcUrls[networkId],
      addresses: localAddressConfig[networkId]
    };
  }
}

async function stageNetwork(env) {
  // theses are the variables that deteremine the network
  const { testchainId, networkId } = env.query;

  try {
    // memoized on networkId - testchainId combination, no memory limit
    const { rpcUrl, addresses } = await getOrFetchNetworkDetails({
      networkId,
      testchainId
    });

    // memoized memory of 1, reinstantiated if the rpcUrl has changed
    const { maker, newMaker } = await getOrReinstantiateMaker({ rpcUrl });
    const { watcher, newWatcher } = await getOrRecreateWatcher({
      rpcUrl,
      addresses
    });

    if (newWatcher)
      store.dispatch({ type: 'CLEAR_ALL_WATCHER_CONTRACT_STATE' });
    // if (newMaker) reattachMakerListeners();

    return { maker, watcher };
  } catch (errMsg) {
    return createPage({
      title: 'Error',
      content: <div>{errMsg}</div>
    });
  }

  // on metamask switch

  // const makerNetworkId = maker.service('web3').networkId();
  // const newNetwork = !eq(networkId, makerNetworkId);
}

function stageAccount() {}

// If any component down the tree would like to change what network the app is connected to, or what address the is UI should display,
// it must replace url params, which will re-run this function. All expensive opetations in this function should be memoized.
// NOTE: all pages are wrapped in a suspense component which displays a loader while these promises are resolving.
function withStagedState(getPage) {
  return async env => {
    try {
      // ensure our maker and watcher instances are connected to the correct network (determined by url params)
      const { maker } = await stageNetwork(env);
      // TODO: ensure we have the current account's cdps and are polling them for state changes
      await stageAccount(env);

      return (
        <MakerHooksProvider maker={maker}>{getPage(env)}</MakerHooksProvider>
      );
    } catch (errMsg) {
      return createPage({
        title: 'Error',
        content: <div>{errMsg}</div>
      });
    }
  };
}

export default createSwitch({
  paths: {
    '/': createPage({
      title: 'Landing',
      content: <Landing />
    }),

    '/overview': env =>
      createPage({
        title: 'Overview',
        getContent: () => withStagedState(() => <Overview />)(env)
      }),

    '/cdp/:type': env => {
      const cdpTypeSlug = env.params.type;
      const address = env.query.address;

      let readOnlyMode = false;
      if (address === undefined) readOnlyMode = true;

      return createPage({
        title: 'CDP',
        getContent: () =>
          withStagedState(() => (
            <CDPPage
              cdpTypeSlug={cdpTypeSlug}
              readOnly={readOnlyMode}
              address={address}
            />
          ))(env)
      });
    }
  }
});
