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
import { getUnique } from 'utils/ui';
import ilkList from 'references/ilkList';

import BigNumber from 'bignumber.js';
import { createCurrencyRatio } from '@makerdao/currency';
import { USD } from '@makerdao/dai';

const { networkNames, defaultNetwork } = config;

async function initUserSnap(request, prevContext) {
  const { network } = request.query;
  if (network !== 'mainnet') {
    userSnapInit();
  }
  return {
    prevContext
  };
}

const networkDetails = async (request, prevContext) => {
  const { testchainId, network } = request.query;
  const { rpcUrl, addresses } = await getOrFetchNetworkDetails({
    network,
    testchainId
  });

  return {
    ...prevContext,
    rpcUrl,
    addresses
  };
};

const makerContext = async (request, prevContext) => {
  const { rpcUrl, addresses } = prevContext;
  const { maker, reinstantiated } = await getOrReinstantiateMaker({
    rpcUrl,
    addresses
  });
  if (reinstantiated) {
    store.dispatch({ type: 'addresses/set', payload: { addresses } });
    await maker.authenticate();
  }
  return {
    ...prevContext,
    maker
  };
};

const watcherContext = async (request, prevContext) => {
  const { rpcUrl, addresses } = prevContext;
  const { watcher, recreated } = await getOrRecreateWatcher({
    rpcUrl,
    addresses
  });

  if (recreated) {
    // all bets are off wrt what contract state in our store
    store.dispatch({ type: 'CLEAR_CONTRACT_STATE' });
    // do our best to attach state listeners to this new network
    await watcher.tap(() => {
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

  return {
    ...prevContext,
    watcher
  };
};

const withDefaultLayout = route =>
  withView(async (request, context) => {
    const { maker } = context;
    let connectedAddress = null;
    try {
      connectedAddress = maker.currentAddress();
    } catch (_) {}

    // FIXME: #0.2.2
    const gemList = getUnique(ilkList, 'gem');
    for (let { gem, currency } of gemList) {
      const pipAddress = addresses[`PIP_${gem}`];
      if (!pipAddress) continue;
      const storage = await maker
        .service('web3')
        ._web3.eth.getStorageAt(pipAddress, 3);
      const val = storage.substr(34);
      const ratio = createCurrencyRatio(USD, currency);
      const price = ratio.wei(new BigNumber('0x' + val.toString()));
      store.dispatch({ type: `${gem}.feedValueUSD`, value: price });
    }

    return (
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
            currentAccount={connectedAddress ? maker.currentAccount() : null}
            address={connectedAddress}
          />
        }
        content={getPage()}
      >
        <View />
      </PageLayout>
    );
  }, route);

const withMakerHooksProvider = (maker, children) => {
  return <MakerHooksProvider maker={maker}>{children}</MakerHooksProvider>;
};

const withModalProvider = children => {
  return (
    <ModalProvider modals={modals} templates={templates}>
      {children}
    </ModalProvider>
  );
};

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
    withContext(initUserSnap),
    withContext(networkDetails),
    withContext(makerContext),
    withContext(watcherContext),
    mount({
      '/': route((request, context) => {
        return {
          title: 'Landing',
          view: withMakerHooksProvider(
            context.maker,
            withModalProvider(<Landing />)
          )
        };
      }),

      '/overview': withDefaultLayout(
        route((request, context) => {
          return {
            title: 'Overview',
            view: withMakerHooksProvider(
              context.maker,
              withModalProvider(<Overview />)
            )
          };
        })
      ),

      '/cdp/:type': withDefaultLayout(
        route(request => {
          const cdpTypeSlug = request.params.type;

          return {
            title: 'CDP',
            view: withMakerHooksProvider(
              context.maker,
              withModalProvider(<CDPPage cdpTypeSlug={cdpTypeSlug} />)
            )
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
