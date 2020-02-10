import React, { useCallback, useState } from 'react';
import { Flex, Grid, Text, Button } from '@makerdao/ui-components-core';

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
import AccountSelection from 'components/AccountSelection';
import DSRInfo from 'components/DSRInfo';
import useMaker from 'hooks/useMaker';
import useStore from 'hooks/useStore';
import useLanguage from 'hooks/useLanguage';
import useDsrEventHistory from 'hooks/useDsrEventHistory';
import useModal from 'hooks/useModal';
import useProxy from 'hooks/useProxy';
import useAnalytics from 'hooks/useAnalytics';
import useSidebar from 'hooks/useSidebar';
import { FeatureFlags } from 'utils/constants';

function Save() {
  const { lang } = useLanguage();
  const { account, network } = useMaker();
  const [{ savings }] = useStore();

  const { proxyAddress, hasProxy, proxyLoading } = useProxy();
  const { trackBtnClick } = useAnalytics('DsrView');

  const { events, isLoading } = FeatureFlags.FF_DSR_HISTORY
    ? useDsrEventHistory(proxyAddress) // eslint-disable-line react-hooks/rules-of-hooks
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

  return (
    <PageContentLayout>
      {!account ? (
        <AccountSelection />
      ) : proxyLoading && !hasProxy ? (
        <LoadingLayout />
      ) : !hasProxy && showOnboarding ? (
        <Flex
          height="70vh"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Text.p t="h4" mb="26px">
            {lang.formatString(
              lang.save.get_started_title,
              `${savings?.yearlyRate.toFixed(2)}%`
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
        </Flex>
      ) : (
        <>
          <Text.h2 pr="m" mb="m" color="darkPurple">
            {lang.save.title}
          </Text.h2>
          <Grid
            py="m"
            gridColumnGap="l"
            gridTemplateColumns={{
              0: '1fr',
              1: '1fr',
              xl: '1fr 1fr'
            }}
          >
            {account ? (
              <DSRInfo
                key={account.address}
                address={account.address}
                isMobile={isMobile}
              />
            ) : (
              <div />
            )}
            <CdpViewCard title={lang.save.deposit_withdraw}>
              <ActionContainerRow
                title={lang.save.deposit_btn_cta}
                button={
                  <ActionButton
                    data-testid={'sidebar-deposit-button'}
                    disabled={!account}
                    onClick={() => {
                      trackBtnClick('Deposit');
                      showAction({ type: 'dsrdeposit' });
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
                    disabled={!account}
                    data-testid={'sidebar-withdraw-button'}
                    onClick={() => {
                      trackBtnClick('Withdraw');
                      showAction({ type: 'dsrwithdraw' });
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
      )}
      {actionShown && (
        <FullScreenAction {...actionShown} reset={() => setActionShown(null)} />
      )}
    </PageContentLayout>
  );
}

export default Save;
