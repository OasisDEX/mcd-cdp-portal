import React, { useCallback, useState, useEffect } from 'react';
import {
  Flex,
  Grid,
  Text,
  Button,
  Address
} from '@makerdao/ui-components-core';

import theme from '../styles/theme';
import PageContentLayout from 'layouts/PageContentLayout';
import LoadingLayout from 'layouts/LoadingLayout';
import {
  ActionButton,
  ActionContainerRow,
  CdpViewCard
} from 'components/CDPDisplay/subcomponents';
import FullScreenAction from 'components/CDPDisplay/FullScreenAction';
import History from 'components/CDPDisplay/History';
import DSRInfo from 'components/DSRInfo';
import useMaker from 'hooks/useMaker';
import useLanguage from 'hooks/useLanguage';
import useDsrEventHistory from 'hooks/useDsrEventHistory';
import useModal from 'hooks/useModal';
import useAnalytics from 'hooks/useAnalytics';
import useSidebar from 'hooks/useSidebar';
import useSavings from 'hooks/useSavings';
import useNotification from 'hooks/useNotification';

import { FeatureFlags } from 'utils/constants';
import { watch } from 'hooks/useObservable';
import { NotificationList, SAFETY_LEVELS } from 'utils/constants';

function Save({ viewedAddress }) {
  const { lang } = useLanguage();
  const { account, network } = useMaker();
  const { addNotification, deleteNotifications } = useNotification();

  useEffect(() => {
    if (account && viewedAddress && viewedAddress !== account.address) {
      addNotification({
        id: NotificationList.NON_OVERVIEW_OWNER,
        content: lang.formatString(
          lang.notifications.non_savings_owner,
          <Address full={viewedAddress} shorten={true} expandable={false} />
        ),
        level: SAFETY_LEVELS.WARNING
      });
    }
    return () => deleteNotifications([NotificationList.NON_OVERVIEW_OWNER]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewedAddress, account]);

  const viewedProxyAddress = watch.proxyAddress(viewedAddress);
  const savings = useSavings(viewedAddress);

  const { trackBtnClick } = useAnalytics('DsrView');

  const { events, isLoading } = FeatureFlags.FF_DSR_HISTORY
    ? useDsrEventHistory(viewedProxyAddress) // eslint-disable-line react-hooks/rules-of-hooks
    : {};

  const [showOnboarding, setShowOnboarding] = useState(true);
  const hideOnboarding = useCallback(() => {
    setShowOnboarding(false);
  }, [setShowOnboarding]);

  const { show } = useModal();

  const emSize = parseInt(getComputedStyle(document.body).fontSize);
  const pxBreakpoint = parseInt(theme.breakpoints.l) * emSize;
  const isMobile = document.documentElement.clientWidth < pxBreakpoint;

  const { show: showSidebar } = useSidebar();
  const [actionShown, setActionShown] = useState(null);
  const showAction = props => {
    if (isMobile) {
      setActionShown(props);
    } else {
      showSidebar(props);
    }
  };
  const annualDaiSavingsRate = watch.annualDaiSavingsRate();
  return (
    <PageContentLayout>
      {viewedProxyAddress === undefined ? (
        <LoadingLayout />
      ) : viewedProxyAddress === null && showOnboarding ? (
        <Flex
          height="70vh"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          {viewedAddress === account?.address ? (
            <>
              <Text.p t="h4" mb="26px">
                {lang.formatString(
                  lang.save.get_started_title,
                  `${
                    annualDaiSavingsRate
                      ? annualDaiSavingsRate.toFixed(2)
                      : '0.00'
                  }%`
                )}
              </Text.p>
              <Button
                p="s"
                css={{ cursor: 'pointer' }}
                onClick={() =>
                  show({
                    modalType: 'dsrdeposit',
                    modalTemplate: 'fullscreen',
                    modalProps: { hideOnboarding }
                  })
                }
              >
                {lang.actions.get_started}
              </Button>
            </>
          ) : (
            <Text.p t="h4" mb="s">
              {lang.save.no_savings}
            </Text.p>
          )}
        </Flex>
      ) : savings && savings.fetchedSavings ? (
        <>
          <Text.h2>{lang.save.title}</Text.h2>
          <Grid
            py="m"
            gridColumnGap="l"
            gridTemplateColumns={{
              0: '1fr',
              1: '1fr',
              xl: '1fr 1fr'
            }}
          >
            <DSRInfo
              key={`${viewedAddress}.${savings.proxyAddress}`}
              isMobile={isMobile}
              savings={savings}
            />
            <CdpViewCard title={lang.save.deposit_withdraw}>
              <ActionContainerRow
                title={lang.save.deposit_btn_cta}
                button={
                  <ActionButton
                    data-testid={'sidebar-deposit-button'}
                    disabled={!account || viewedAddress !== account?.address}
                    onClick={() => {
                      trackBtnClick('Deposit');
                      showAction({ type: 'dsrdeposit', props: { savings } });
                    }}
                  >
                    {lang.actions.deposit}
                  </ActionButton>
                }
              />
              <ActionContainerRow
                title={lang.save.withdraw_btn_cta}
                button={
                  <ActionButton
                    disabled={!account || viewedAddress !== account?.address}
                    data-testid={'sidebar-withdraw-button'}
                    onClick={() => {
                      trackBtnClick('Withdraw');
                      showAction({ type: 'dsrwithdraw', props: { savings } });
                    }}
                  >
                    {lang.actions.withdraw}
                  </ActionButton>
                }
              />
            </CdpViewCard>
          </Grid>
          {FeatureFlags.FF_DSR_HISTORY && (
            <History
              title={lang.save.tx_history}
              rows={events}
              network={network}
              isLoading={isLoading}
              emptyTableMessage={lang.save.start_earning}
            />
          )}
        </>
      ) : (
        <LoadingLayout />
      )}
      {actionShown && (
        <FullScreenAction {...actionShown} reset={() => setActionShown(null)} />
      )}
    </PageContentLayout>
  );
}

export default Save;
