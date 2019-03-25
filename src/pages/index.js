import React from 'react';
import {
  map,
  route,
  mount,
  redirect,
  compose,
  withView,
  withContext
} from 'navi';
import { View } from 'react-navi';

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
import ilkList from 'references/ilkList';

const { networkNames, defaultNetwork } = config;

console.log('modasdasd', modals, templates);
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

  return { maker, stateFetchPromise };
}

// Any component that would like to change the network must replace url query params, re-running this function.
const authenticatedContext = async (request, prevContext) => {
  // ensure our maker and watcher instances are connected to the correct network
  const { maker, stateFetchPromise } = await stageNetwork(request.query);
  let connectedAddress = null;

  try {
    connectedAddress = maker.currentAddress();
  } catch (_) {
    // if no account is connected, or if maker.authenticate is still resolving, we render in read-only mode
  }

  await maker.authenticate();
  await stateFetchPromise;
  const networkId = maker.service('web3').networkId();

  return { ...prevContext, connectedAddress, networkId, maker };
};

const withDefaultLayout = route =>
  withView((request, context) => {
    const { connectedAddress, networkId, maker } = context;
    return (
      <PageLayout
        mobileNav={
          <MobileNav
            network={{
              id: networkId
            }}
            address={connectedAddress}
          />
        }
        navbar={<Navbar address={connectedAddress} />}
        sidebar={
          <Sidebar
            network={{
              id: networkId
            }}
            currentAccount={connectedAddress ? maker.currentAccount() : null}
            address={connectedAddress}
          />
        }
      >
        <View />
      </PageLayout>
    );
  }, route);

const hasNetwork = route =>
  map((request, context) => {
    if (networkIsUndefined(request)) {
      return createDefaultNetworkRedirect(request);
    } else {
      return route;
    }
  });

export default hasNetwork(
  compose(
    withContext(authenticatedContext),
    withView(
      <ModalProvider modals={modals} templates={templates}>
        <View />
      </ModalProvider>
    ),
    withView((request, context) => (
      <MakerHooksProvider maker={context.maker}>
        <View />
      </MakerHooksProvider>
    )),
    mount({
      '/': route(request => {
        return {
          title: 'Landing',
          view: <Landing />
        };
      }),

      '/overview': withDefaultLayout(
        route(request => {
          return {
            title: 'Overview',
            view: <Overview />
          };
        })
      ),

      '/cdp/:type': withDefaultLayout(
        route(request => {
          const cdpTypeSlug = request.params.type;

          return {
            title: 'CDP',
            view: <CDPPage cdpTypeSlug={cdpTypeSlug} />
          };
        })
      )
    })
  )
);

function networkIsUndefined(request) {
  return (
    request.query.network === undefined &&
    request.query.testchainId === undefined
  );
}

function createDefaultNetworkRedirect(request) {
  const { address } = request.query;
  const { mountpath } = request;
  const addressQuery = address === undefined ? '?' : `?address=${address}&`;

  return redirect(
    `${mountpath === '/' ? '' : mountpath}/${addressQuery}network=${
      networkNames[defaultNetwork]
    }`
  );
}
