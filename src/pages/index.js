import React from 'react';
import { createPage, createRedirect, createSwitch } from 'navi';
import { Grid } from '@makerdao/ui-components';

import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import Landing from './Landing';
import Overview from './Overview';
import CDPPage from './CDP';

import { getOrRecreateWatcher } from '../watch';
import config from 'references/config';
import localAddressConfig from 'references/addresses.json';
import { getOrReinstantiateMaker } from '../maker';
import { getTestchainDetails, networkNameToId } from 'utils/network';
import MakerHooksProvider from 'components/context/MakerHooksProvider';

const { supportedNetworkIds, rpcUrls, networkNames, defaultNetwork } = config;

const _cache = {};
export async function getOrFetchNetworkDetails({ network, testchainId }) {
  // is this a pair we've seen before?
  const serializedKey = JSON.stringify({ network, testchainId });
  if (_cache[serializedKey] !== undefined) return _cache[serializedKey];

  // if we have a testchain id, try to connect to an ex testchain instance
  if (testchainId !== undefined) {
    const { rpcUrl, addresses, notFound } = await getTestchainDetails(
      testchainId
    );

    if (notFound) throw new Error(`Testchain id ${testchainId} not found`);

    _cache[serializedKey] = { rpcUrl, addresses };
  } else {
    const networkId = networkNameToId(network);

    if (!supportedNetworkIds.includes(networkId))
      throw new Error(`Unsupported network: ${network}`);

    _cache[serializedKey] = {
      rpcUrl: rpcUrls[networkId],
      addresses: localAddressConfig[networkId]
    };
  }

  return _cache[serializedKey];
}

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

  // const { watcher, newWatcher } = await getOrRecreateWatcher({
  //   rpcUrl,
  //   addresses
  // });

  // if (newWatcher) {
  //   // this is a new network, all bets are off
  //   store.dispatch({ type: 'CLEAR_CONTRACT_STATE' });
  // }

  return { maker };
}

// If any component down the tree would like to change which network the app is connected to, it must replace url params,
// which will re-run this function. All expensive operations should be memoized.
// NOTE: pages are wrapped in a suspense component which will display a loader while these promises resolve.
function withStagedNetwork(getPage) {
  return async env => {
    try {
      // ensure our maker and watcher instances are connected to the correct network
      const { maker } = await stageNetwork(env);

      const { pathname } = env;

      let connectedAddress = null;
      try {
        connectedAddress = maker.currentAddress();
      } catch (_) {
        console.log('No connected account');
      }

      const getPageWithMaker = () => (
        <MakerHooksProvider maker={maker}>{getPage()}</MakerHooksProvider>
      );

      if (pathname === '/') return getPageWithMaker();

      await maker.authenticate();
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
        getContent: withStagedNetwork(() => <Landing />)
      });
    },

    '/overview': env => {
      if (networkIsUndefined(env)) return createDefaultNetworkRedirect(env);

      return createPage({
        title: 'Overview',
        getContent: withStagedNetwork(() => <Overview />)
      });
    },

    '/cdp/:type': env => {
      if (networkIsUndefined(env)) return createDefaultNetworkRedirect(env);

      const cdpTypeSlug = env.params.type;

      return createPage({
        title: 'CDP',
        getContent: withStagedNetwork(() => (
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
