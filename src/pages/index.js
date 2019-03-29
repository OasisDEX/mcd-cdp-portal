import React from 'react';
import { map, route, mount, redirect, withView } from 'navi';
import { View } from 'react-navi';

import { Box } from '@makerdao/ui-components-core';
import Navbar from 'components/Navbar';
import Sidebar from 'components/Sidebar';
import PageLayout from 'layouts/PageLayout';
import Landing from './Landing';
import Overview from './Overview';
import CDPPage from './CDP';

import AwaitMakerAuthentication from 'components/AwaitMakerAuthentication';
import MakerHooksProvider from 'providers/MakerHooksProvider';
import WatcherProvider from 'providers/WatcherProvider';

import config from 'references/config';
import MobileNav from 'components/MobileNav';
import { networkNameToId } from 'utils/network';
import { userSnapInit } from 'utils/analytics';
import { getUnique } from 'utils/ui';
import ilkList from 'references/ilkList';
import { getOrFetchNetworkDetails } from 'utils/network';
import useMaker from 'hooks/useMaker';
import useWatcher from 'hooks/useWatcher';

import { createCDPSystemModel } from 'reducers/network/system/model';
import * as cdpTypeModel from 'reducers/network/cdpTypes/model';
import { isMissingContractAddress } from 'utils/ethereum';

import BigNumber from 'bignumber.js';
import { createCurrencyRatio } from '@makerdao/currency';
import { USD } from '@makerdao/dai';
import store from '../store';

const { networkNames, defaultNetwork } = config;

const withDefaultLayout = route =>
  withView(async request => {
    const { network, viewedAddress } = request.query;
    const { addresses, rpcUrl } = await getOrFetchNetworkDetails(request.query);

    const networkId = networkNameToId(network);
    return (
      <WatcherProvider addresses={addresses} rpcUrl={rpcUrl}>
        <MakerHooksProvider addresses={addresses} rpcUrl={rpcUrl}>
          <RouteEffects addresses={addresses} network={network}>
            <AwaitMakerAuthentication>
              <PageLayout
                mobileNav={
                  <MobileNav
                    networkId={networkId}
                    viewedAddress={viewedAddress}
                  />
                }
                navbar={
                  <Navbar
                    connectedAddress={'0x0'}
                    viewedAddress={viewedAddress}
                  />
                }
                sidebar={<Sidebar networkId={networkId} />}
              >
                <View />
              </PageLayout>
            </AwaitMakerAuthentication>
          </RouteEffects>
        </MakerHooksProvider>
      </WatcherProvider>
    );
    // } catch (errMsg) {
    //   return (
    //     <Box m={8}>
    //       <pre>{errMsg.stack}</pre>
    //     </Box>
    //   );
    // }
  }, route);

const hasNetwork = route =>
  map(request => {
    if (networkIsUndefined(request)) {
      return createDefaultNetworkRedirect(request);
    } else {
      return route;
    }
  });

export default hasNetwork(
  mount({
    '/': route(async request => {
      const { network } = request.query;
      const { addresses, rpcUrl } = await getOrFetchNetworkDetails(
        request.query
      );

      return {
        title: 'Landing',
        view: (
          <WatcherProvider addresses={addresses} rpcUrl={rpcUrl}>
            <MakerHooksProvider addresses={addresses} rpcUrl={rpcUrl}>
              <RouteEffects addresses={addresses} network={network}>
                <Landing />
              </RouteEffects>
            </MakerHooksProvider>
          </WatcherProvider>
        )
      };
    }),

    '/owner/:viewedAddress': withDefaultLayout(
      route(request => {
        const { viewedAddress } = request.params;

        return {
          title: 'Overview',
          view: <Overview viewedAddress={viewedAddress} />
        };
      })
    ),

    '/:cdpId': withDefaultLayout(
      route(request => {
        const { cdpId } = request.params;

        return {
          title: 'CDP',
          view: <CDPPage cdpId={cdpId} />
        };
      })
    )
  })
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

function RouteEffects({ children, addresses, network }) {
  const { maker } = useMaker();

  React.useEffect(() => {
    if (maker && addresses)
      (async () => {
        // FIXME: #0.2.2
        await maker.authenticate();
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
      })();
  }, [maker, addresses]);

  React.useEffect(() => {
    if (network !== 'mainnet') userSnapInit();
  }, [network]);

  return (
    <WatcherRouteEffects addresses={addresses}>{children}</WatcherRouteEffects>
  );
}

function WatcherRouteEffects({ addresses, children }) {
  const { watcher } = useWatcher();
  React.useEffect(() => {
    if (!addresses) return;
    // all bets are off wrt what contract state in our store
    store.dispatch({ type: 'CLEAR_CONTRACT_STATE' });
    // do our best to attach state listeners to this new network
    watcher.tap(() => {
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
  }, [addresses]);

  return children;
}
