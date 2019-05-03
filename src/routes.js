import React, { useEffect } from 'react';
import { map, route, mount, redirect, withView } from 'navi';
import { View } from 'react-navi';

import Navbar from 'components/Navbar';
import PageLayout from 'layouts/PageLayout';
import Landing from 'pages/Landing';
import Overview from 'pages/Overview';
import CDPPage from 'pages/CDP';
import sidebars from 'components/Sidebars';
import modals, { templates } from 'components/Modals';
import AwaitMakerAuthentication from 'components/AwaitMakerAuthentication';
import { ModalProvider } from 'providers/ModalProvider';
import { SidebarProvider } from 'providers/SidebarProvider';
import MakerHooksProvider from 'providers/MakerHooksProvider';

import config from 'references/config';
import MobileNav from 'components/MobileNav';
import { networkNameToId } from 'utils/network';
import { userSnapInit } from 'utils/analytics';
import ilkList from 'references/ilkList';
import { getOrFetchNetworkDetails } from 'utils/network';
import useMaker from 'hooks/useMaker';
import useStore from 'hooks/useStore';

import { createCDPSystemModel } from 'reducers/multicall/system';
import * as cdpTypeModel from 'reducers/multicall/feeds';

import { isMissingContractAddress } from 'utils/ethereum';
import { ServiceRoles } from '@makerdao/dai-plugin-mcd';
import { instantiateWatcher } from './watch';
import uniqBy from 'lodash.uniqby';

const { networkNames, defaultNetwork } = config;

const withDefaultLayout = route =>
  hasNetwork(
    withView(async request => {
      const { network } = request.query;
      const { viewedAddress } = request.params;
      const { addresses, rpcUrl } = await getOrFetchNetworkDetails(
        request.query
      );

      const networkId = networkNameToId(network);
      return (
        <MakerHooksProvider
          addresses={addresses}
          rpcUrl={rpcUrl}
          network={network}
        >
          <RouteEffects network={network} />
          <AwaitMakerAuthentication>
            <ModalProvider modals={modals} templates={templates}>
              <SidebarProvider sidebars={sidebars}>
                <PageLayout
                  mobileNav={
                    <MobileNav
                      networkId={networkId}
                      viewedAddress={viewedAddress}
                    />
                  }
                  navbar={<Navbar viewedAddress={viewedAddress} />}
                >
                  <View />
                </PageLayout>
              </SidebarProvider>
            </ModalProvider>
          </AwaitMakerAuthentication>
        </MakerHooksProvider>
      );
    }, route)
  );

const hasNetwork = route =>
  map(request => {
    if (networkIsUndefined(request)) {
      return redirect(`./?network=${networkNames[defaultNetwork]}`);
    } else {
      return route;
    }
  });

export default mount({
  '/': hasNetwork(
    route(async request => {
      const { network } = request.query;
      const { addresses, rpcUrl } = await getOrFetchNetworkDetails(
        request.query
      );

      return {
        title: 'Landing',
        view: (
          <MakerHooksProvider
            addresses={addresses}
            rpcUrl={rpcUrl}
            network={network}
          >
            <RouteEffects network={network} />
            <ModalProvider modals={modals} templates={templates}>
              <Landing />
            </ModalProvider>
          </MakerHooksProvider>
        )
      };
    })
  ),

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
    map(request => {
      const { cdpId } = request.params;

      if (!/^\d+$/.test(cdpId))
        return route({ view: <div>invalid cdp id</div> });

      return route({
        title: 'CDP',
        view: <CDPPage cdpId={cdpId} />
      });
    })
  )
});

function networkIsUndefined(request) {
  const { query } = request;
  return query.network === undefined && query.testchainId === undefined;
}

function RouteEffects({ network }) {
  const { maker } = useMaker();
  const [, dispatch] = useStore();

  useEffect(() => {
    if (!maker) return;
    const { cdpTypes } = maker.service(ServiceRoles.CDP_TYPE);
    uniqBy(cdpTypes, t => t.currency.symbol).forEach(type =>
      // the fire-&-forget promises are intentional
      type.getPrice().then(price => {
        const gem = type.currency.symbol;
        dispatch({ type: `${gem}.feedValueUSD`, value: price });
      })
    );
  }, [maker]);

  useEffect(() => {
    if (network !== 'mainnet') userSnapInit();
  }, [network]);

  useEffect(() => {
    if (!maker) return;
    const scs = maker.service('smartContract');
    const addresses = scs.getContractAddresses();
    const watcher = instantiateWatcher({
      rpcUrl: maker.service('web3').rpcUrl,
      multicallAddress: scs.getContractAddress('MULTICALL')
    });

    watcher.subscribe(({ type, value }) => {
      dispatch({ type, value });
    });

    // all bets are off wrt what contract state in our store
    dispatch({ type: 'CLEAR_CONTRACT_STATE' });
    watcher.start();
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
  }, [maker]);

  return null;
}
