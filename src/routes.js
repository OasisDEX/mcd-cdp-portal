import React, { useEffect } from 'react';
import { map, route, mount, withView, compose } from 'navi';
import { View } from 'react-navi';

import Navbar from 'components/Navbar';
import DashboardLayout from 'layouts/DashboardLayout';
import MarketingLayout from './layouts/MarketingLayout';
import Landing from 'pages/Landing';
import Overview from 'pages/Overview';
import Borrow from 'pages/Borrow';
import BorrowWBTCLanding from 'pages/BorrowWBTCLanding';
import Save from 'pages/Save';
import SaveOverview from 'pages/SaveOverview';
import TradeLanding from 'pages/TradeLanding';
import Privacy from 'pages/Privacy';
import Terms from 'pages/Terms';
import CDPDisplay from 'components/CDPDisplay';
import modals, { templates } from 'components/Modals';
import { ModalProvider } from 'providers/ModalProvider';
import { SidebarProvider } from 'providers/SidebarProvider';
import { ToggleProvider } from 'providers/ToggleProvider';
import MakerProvider from 'providers/MakerProvider';
import VaultsProvider from 'providers/VaultsProvider';
import TransactionManagerProvider from 'providers/TransactionManagerProvider';
import NotificationProvider from 'providers/NotificationProvider';
import config from 'references/config';
import MobileNav from 'components/MobileNav';
import { userSnapInit } from 'utils/analytics';
import { Routes } from 'utils/constants';
import useLanguage from './hooks/useLanguage';
import Helmet from 'react-helmet';

const { networkNames, defaultNetwork } = config;

const dappProvidersView = async request => {
  const {
    network = networkNames[defaultNetwork],
    testchainId,
    backendEnv
  } = request.query;
  const { viewedAddress } = request.params;

  return (
    <MakerProvider
      network={network}
      testchainId={testchainId}
      backendEnv={backendEnv}
      viewedAddress={viewedAddress}
    >
      <RouteEffects network={network} />
      <TransactionManagerProvider>
        <NotificationProvider>
          <VaultsProvider viewedAddress={viewedAddress}>
            <ToggleProvider>
              <ModalProvider modals={modals} templates={templates}>
                <SidebarProvider>
                  <View />
                </SidebarProvider>
              </ModalProvider>
            </ToggleProvider>
          </VaultsProvider>
        </NotificationProvider>
      </TransactionManagerProvider>
    </MakerProvider>
  );
};

const withDashboardLayout = childMatcher =>
  compose(
    withView(dappProvidersView),
    withView(request => {
      const { viewedAddress, cdpId } = request.params;
      return (
        <DashboardLayout
          mobileNav={<MobileNav viewedAddress={viewedAddress} cdpId={cdpId} />}
          navbar={<Navbar viewedAddress={viewedAddress} />}
        >
          <View />
        </DashboardLayout>
      );
    }),
    childMatcher
  );

const marketingLayoutView = () => (
  <MarketingLayout showNavInFooter={true}>
    <View />
  </MarketingLayout>
);

// META TAGS
const PageHead = ({ title, description, imgUrl }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <meta name="twitter:card" value="summary" />
    <meta property="og:title" content={title} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="http://oasis.app" />
    <meta property="og:image" content={imgUrl} />
    <meta property="og:description" content={description} />
  </Helmet>
);

const LandingHead = () => {
  const { lang } = useLanguage();

  return (
    <>
      <PageHead
        title={lang.landing_page.meta.title}
        description={lang.landing_page.meta.description}
        imgUrl="https://oasis.app/meta/Oasis-app.png"
      />
      <View />
    </>
  );
};

const BorrowHead = () => {
  const { lang } = useLanguage();

  return (
    <>
      <PageHead
        title={lang.borrow_landing.meta.title}
        description={lang.borrow_landing.meta.description}
        imgUrl="https://oasis.app/meta/Oasis_Borrow.png"
      />
      <View />
    </>
  );
};

const SaveHead = () => {
  const { lang } = useLanguage();

  return (
    <>
      <PageHead
        title={lang.save_landing.meta.title}
        description={lang.save_landing.meta.description}
        imgUrl="https://oasis.app/meta/Oasis_Save.png"
      />
      <View />
    </>
  );
};

const TradeHead = () => {
  const { lang } = useLanguage();

  return (
    <>
      <PageHead
        title={lang.trade_landing.meta.title}
        description={lang.trade_landing.meta.description}
        imgUrl="https://oasis.app/meta/Oasis_Trade.png"
      />
      <View />
    </>
  );
};

export default mount({
  '/': compose(
    withView(() => <LandingHead />),
    withView(() => <Landing />)
  ),

  [`/${Routes.BORROW}`]: compose(
    // a custom BorrowHead view is used instead of Navi's withTitle and
    // withHead, so that we get translated meta-tags
    withView(() => <BorrowHead />),
    withView(dappProvidersView),
    withView(marketingLayoutView),
    withView(() => <Borrow />)
  ),

  [`/${Routes.BORROW}/owner/:viewedAddress`]: compose(
    withView(() => <BorrowHead />),
    withDashboardLayout(
      route(request => {
        const { viewedAddress } = request.params;
        return {
          title: 'Overview',
          view: <Overview viewedAddress={viewedAddress} />
        };
      })
    )
  ),

  [`/${Routes.BORROW}/:cdpId`]: compose(
    withView(() => <BorrowHead />),
    withDashboardLayout(
      map(request => {
        const { cdpId } = request.params;

        if (!/^\d+$/.test(cdpId))
          return route({ view: <div>invalid cdp id</div> });

        return route({ title: 'CDP', view: <CDPDisplay cdpId={cdpId} /> });
      })
    )
  ),

  [`/${Routes.BORROW}/btc`]: compose(
    withView(() => <BorrowHead />),
    withView(dappProvidersView),
    withView(marketingLayoutView),
    route(() => ({ title: 'Borrow', view: <BorrowWBTCLanding /> }))
  ),

  [`/${Routes.SAVE}`]: compose(
    withView(() => <SaveHead />),
    withView(dappProvidersView),
    withView(marketingLayoutView),
    route(() => ({ title: 'Save', view: <SaveOverview /> }))
  ),

  [`/${Routes.SAVE}/owner/:viewedAddress`]: compose(
    withView(() => <SaveHead />),
    withDashboardLayout(
      route(request => {
        const { viewedAddress } = request.params;
        return {
          title: 'Save',
          view: <Save viewedAddress={viewedAddress} />
        };
      })
    )
  ),

  [`/${Routes.TRADE}`]: compose(
    withView(() => <TradeHead />),
    withView(marketingLayoutView),
    route(() => ({ title: 'Trade', view: <TradeLanding /> }))
  ),

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
