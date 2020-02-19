import React, { lazy, useEffect } from 'react';
import { map, route, mount, withView } from 'navi';
import { View } from 'react-navi';

import Navbar from 'components/Navbar';
import BorrowLayout from 'layouts/BorrowLayout';
import SaveLayout from 'layouts/SaveLayout';

import CDPDisplay from 'components/CDPDisplay';
import modals, { templates } from 'components/Modals';
import { ModalProvider } from 'providers/ModalProvider';
import { SidebarProvider } from 'providers/SidebarProvider';
import { ToggleProvider } from 'providers/ToggleProvider';
import MakerProvider from 'providers/MakerProvider';

import config from 'references/config';
import MobileNav from 'components/MobileNav';
import { userSnapInit } from 'utils/analytics';
import { Routes } from 'utils/constants';

const Landing = lazy(() => import('pages/Landing'));
const Overview = lazy(() => import('pages/Overview'));
const Borrow = lazy(() => import('pages/Borrow'));
const Save = lazy(() => import('pages/Save'));
const Privacy = lazy(() => import('pages/Privacy'));
const Terms = lazy(() => import('pages/Terms'));

const { networkNames, defaultNetwork } = config;

const withBorrowLayout = route =>
  withView(async request => {
    const {
      network = networkNames[defaultNetwork],
      testchainId,
      backendEnv
    } = request.query;
    const { viewedAddress, cdpId } = request.params;

    return (
      <MakerProvider
        network={network}
        testchainId={testchainId}
        backendEnv={backendEnv}
        viewedAddress={viewedAddress}
      >
        <RouteEffects network={network} />
        <ToggleProvider>
          <ModalProvider modals={modals} templates={templates}>
            <SidebarProvider>
              <BorrowLayout
                mobileNav={
                  <MobileNav viewedAddress={viewedAddress} cdpId={cdpId} />
                }
                navbar={<Navbar viewedAddress={viewedAddress} />}
              >
                <View />
              </BorrowLayout>
            </SidebarProvider>
          </ModalProvider>
        </ToggleProvider>
      </MakerProvider>
    );
  }, route);

const withSaveLayout = route =>
  withView(async request => {
    const {
      network = networkNames[defaultNetwork],
      testchainId,
      backendEnv
    } = request.query;
    const { viewedAddress, cdpId } = request.params;

    return (
      <MakerProvider
        network={network}
        testchainId={testchainId}
        backendEnv={backendEnv}
      >
        <RouteEffects network={network} />
        <ToggleProvider>
          <ModalProvider modals={modals} templates={templates}>
            <SidebarProvider>
              <SaveLayout
                mobileNav={
                  <MobileNav viewedAddress={viewedAddress} cdpId={cdpId} />
                }
                navbar={<Navbar viewedAddress={viewedAddress} />}
              >
                <View />
              </SaveLayout>
            </SidebarProvider>
          </ModalProvider>
        </ToggleProvider>
      </MakerProvider>
    );
  }, route);

export default mount({
  '/': route(() => ({ title: 'Landing', view: <Landing /> })),

  [`/${Routes.BORROW}`]: withBorrowLayout(
    route(() => ({ title: 'Borrow', view: <Borrow /> }))
  ),

  [`/${Routes.BORROW}/owner/:viewedAddress`]: withBorrowLayout(
    route(request => {
      const { viewedAddress } = request.params;
      return {
        title: 'Overview',
        view: <Overview viewedAddress={viewedAddress} />
      };
    })
  ),

  [`/${Routes.BORROW}/:cdpId`]: withBorrowLayout(
    map(request => {
      const { cdpId } = request.params;

      if (!/^\d+$/.test(cdpId))
        return route({ view: <div>invalid cdp id</div> });

      return route({ title: 'CDP', view: <CDPDisplay cdpId={cdpId} /> });
    })
  ),

  [`/${Routes.SAVE}`]: withSaveLayout(
    route(() => ({ title: 'Save', view: <Save /> }))
  ),

  [`/${Routes.TRADE}`]: route(() => {
    window.location.href = 'https://oasis.app/trade';
  }),

  [`/${Routes.PRIVACY}`]: route(() => ({
    title: 'Oasis - Privacy Policy',
    view: <Privacy />
  })),

  [`/${Routes.TERMS}`]: route(() => ({
    title: 'Oasis - Terms of Service',
    view: <Terms />
  }))
});

function RouteEffects({ network }) {
  useEffect(() => {
    if (network !== 'mainnet' && window.location.hostname !== 'localhost')
      userSnapInit();
  }, [network]);
  return null;
}
