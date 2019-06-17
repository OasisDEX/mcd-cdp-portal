import React, { useEffect } from 'react';
import { map, route, mount, redirect, withView } from 'navi';
import { View } from 'react-navi';

import Navbar from 'components/Navbar';
import PageLayout from 'layouts/PageLayout';
import Landing from 'pages/Landing';
import Overview from 'pages/Overview';
import CDPView from 'pages/CDP';
import sidebars from 'components/Sidebars';
import modals, { templates } from 'components/Modals';
import AwaitMakerAuthentication from 'components/AwaitMakerAuthentication';
import { ModalProvider } from 'providers/ModalProvider';
import { SidebarProvider } from 'providers/SidebarProvider';
import MakerProvider from 'providers/MakerProvider';

import config from 'references/config';
import MobileNav from 'components/MobileNav';
import { networkNameToId } from 'utils/network';
import { userSnapInit } from 'utils/analytics';
import { getOrFetchNetworkDetails } from 'utils/network';
import useMaker from 'hooks/useMaker';
import useStore from 'hooks/useStore';
import { startWatcher } from './watch';

const { networkNames, defaultNetwork } = config;

const withDefaultLayout = route =>
  hasNetwork(
    withView(async request => {
      const { network, testchainId, backendEnv } = request.query;
      const { viewedAddress } = request.params;
      const { rpcUrl } = await getOrFetchNetworkDetails(request.query);

      const networkId = networkNameToId(network);
      return (
        <MakerProvider
          rpcUrl={rpcUrl}
          network={network}
          testchainId={testchainId}
          backendEnv={backendEnv}
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
        </MakerProvider>
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
      const { network, testchainId, backendEnv } = request.query;
      const { rpcUrl } = await getOrFetchNetworkDetails(request.query);

      return {
        title: 'Landing',
        view: (
          <MakerProvider
            rpcUrl={rpcUrl}
            network={network}
            testchainId={testchainId}
            backendEnv={backendEnv}
          >
            <RouteEffects network={network} />
            <ModalProvider modals={modals} templates={templates}>
              <Landing />
            </ModalProvider>
          </MakerProvider>
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
        view: <CDPView cdpId={cdpId} />
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
    if (network !== 'mainnet' && window.location.hostname !== 'localhost')
      userSnapInit();
  }, [network]);

  useEffect(() => {
    if (!maker) return;
    const scs = maker.service('smartContract');
    startWatcher({
      rpcUrl: maker.service('web3').rpcUrl,
      multicallAddress: scs.getContractAddress('MULTICALL'),
      addresses: scs.getContractAddresses(),
      dispatch
    });
  }, [maker]);

  return null;
}
