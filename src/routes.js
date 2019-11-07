import React, { useEffect } from 'react';
import { map, route, mount, redirect, withView } from 'navi';
import { View } from 'react-navi';

import Navbar from 'components/Navbar';
import BorrowLayout from 'layouts/BorrowLayout';
import SaveLayout from 'layouts/SaveLayout';
import Landing from 'pages/Landing';
import Overview from 'pages/Overview';
import Borrow from 'pages/Borrow';
import Save from 'pages/Save';
import Privacy from 'pages/Privacy';
import Terms from 'pages/Terms';
import CDPDisplay from 'components/CDPDisplay';
import modals, { templates } from 'components/Modals';
import AwaitMakerAuthentication from 'components/AwaitMakerAuthentication';
import { ModalProvider } from 'providers/ModalProvider';
import { SidebarProvider } from 'providers/SidebarProvider';
import { BannerProvider } from 'providers/BannerProvider';
import { ToggleProvider } from 'providers/ToggleProvider';
import MakerProvider from 'providers/MakerProvider';
import EthBalanceProvider from 'providers/EthBalanceProvider';

import config from 'references/config';
import MobileNav from 'components/MobileNav';
import { userSnapInit } from 'utils/analytics';
import { Routes } from 'utils/constants';

const { networkNames, defaultNetwork } = config;

const withBorrowLayout = route =>
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
            <EthBalanceProvider>
              <ToggleProvider>
                <ModalProvider modals={modals} templates={templates}>
                  <SidebarProvider>
                    <BannerProvider>
                      <BorrowLayout
                        mobileNav={
                          <MobileNav
                            viewedAddress={viewedAddress}
                            cdpId={cdpId}
                          />
                        }
                        navbar={<Navbar viewedAddress={viewedAddress} />}
                      >
                        <View />
                      </BorrowLayout>
                    </BannerProvider>
                  </SidebarProvider>
                </ModalProvider>
              </ToggleProvider>
            </EthBalanceProvider>
          </AwaitMakerAuthentication>
        </MakerProvider>
      );
    }, route)
  );

const withSaveLayout = route =>
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
            <EthBalanceProvider>
              <ToggleProvider>
                <ModalProvider modals={modals} templates={templates}>
                  <SidebarProvider>
                    <SaveLayout
                      mobileNav={
                        <MobileNav
                          viewedAddress={viewedAddress}
                          cdpId={cdpId}
                        />
                      }
                      navbar={<Navbar viewedAddress={viewedAddress} />}
                    >
                      <View />
                    </SaveLayout>
                  </SidebarProvider>
                </ModalProvider>
              </ToggleProvider>
            </EthBalanceProvider>
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

  [`/${Routes.BORROW}`]: withBorrowLayout(
    route(() => {
      return {
        title: 'Borrow',
        view: <Borrow />
      };
    })
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

      return route({
        title: 'CDP',
        view: <CDPDisplay cdpId={cdpId} />
      });
    })
  ),

  [`/${Routes.SAVE}`]: withSaveLayout(
    route(() => {
      return {
        title: 'Save',
        view: <Save />
      };
    })
  ),

  [`/${Routes.TRADE}`]: route(() => {
    window.location.href = 'https://staging.oasis.app/trade';
  }),

  [`/${Routes.PRIVACY}`]: route(() => {
    return {
      title: 'Oasis - Privacy Policy',
      view: <Privacy />
    };
  }),

  [`/${Routes.TERMS}`]: route(() => {
    return {
      title: 'Oasis - Terms of Service',
      view: <Terms />
    };
  })
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
