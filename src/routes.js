import React, { useEffect } from 'react';
import { map, route, mount, redirect, withView } from 'navi';
import { View } from 'react-navi';

import Navbar from 'components/Navbar';
import PageLayout from 'layouts/PageLayout';
import Landing from 'pages/Landing';
import Overview from 'pages/Overview';
import Auth from 'pages/Auth';
import CDPDisplay from 'components/CDPDisplay';
import modals, { templates } from 'components/Modals';
import AwaitMakerAuthentication from 'components/AwaitMakerAuthentication';
import { ModalProvider } from 'providers/ModalProvider';
import { SidebarProvider } from 'providers/SidebarProvider';
import MakerProvider from 'providers/MakerProvider';

import config from 'references/config';
import MobileNav from 'components/MobileNav';
import { userSnapInit } from 'utils/analytics';
import { Routes } from 'utils/constants';

const { networkNames, defaultNetwork } = config;

const withDefaultLayout = route =>
  hasNetwork(
    withView(async request => {
      const { network, testchainId, backendEnv } = request.query;
      const { viewedAddress, cdpId } = request.params;

      return (
        <MakerProvider
          network={network}
          testchainId={testchainId}
          backendEnv={backendEnv}
        >
          <RouteEffects network={network} />
          <AwaitMakerAuthentication>
            <ModalProvider modals={modals} templates={templates}>
              <SidebarProvider>
                <PageLayout
                  mobileNav={
                    <MobileNav viewedAddress={viewedAddress} cdpId={cdpId} />
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
      return {
        title: 'Landing',
        view: (
          <MakerProvider
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

  [`/${Routes.BORROW}`]: withDefaultLayout(
    route(() => {
      return {
        title: 'Auth',
        view: <Auth />
      };
    })
  ),

  [`/${Routes.BORROW}/owner/:viewedAddress`]: withDefaultLayout(
    route(request => {
      const { viewedAddress } = request.params;
      return {
        title: 'Overview',
        view: <Overview viewedAddress={viewedAddress} />
      };
    })
  ),

  [`/${Routes.BORROW}/:cdpId`]: withDefaultLayout(
    map(request => {
      const { cdpId } = request.params;

      if (!/^\d+$/.test(cdpId))
        return route({ view: <div>invalid cdp id</div> });

      return route({
        title: 'CDP',
        view: <CDPDisplay cdpId={cdpId} />
      });
    })
  )
});

function networkIsUndefined(request) {
  const { query } = request;
  return query.network === undefined && query.testchainId === undefined;
}

function RouteEffects({ network }) {
  useEffect(() => {
    if (network !== 'mainnet' && window.location.hostname !== 'localhost')
      userSnapInit();
  }, [network]);
  return null;
}
