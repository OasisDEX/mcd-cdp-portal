import React, { useEffect, useState } from 'react';
import round from 'lodash/round';
import { Address } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';
import useEventHistory from 'hooks/useEventHistory';
import useMaker from 'hooks/useMaker';

import { TextBlock } from 'components/Typography';
import PageContentLayout from 'layouts/PageContentLayout';
import { Box, Grid, Flex, Text } from '@makerdao/ui-components-core';
import History from './History';
import {
  ActionButton,
  ActionContainerRow,
  AmountDisplay,
  CdpViewCard,
  ExtraInfo,
  InfoContainerRow
} from './subcomponents';
import theme from '../../styles/theme';
import FullScreenAction from './FullScreenAction';
import debug from 'debug';
import useNotification from 'hooks/useNotification';
import useAnalytics from 'hooks/useAnalytics';
import { FeatureFlags } from 'utils/constants';
import { NotificationList, SAFETY_LEVELS } from 'utils/constants';

const log = debug('maker:CDPDisplay/Presentation');
const { FF_VAULT_HISTORY } = FeatureFlags;

export const formatValue = (val, precision) => {
  val = val.toNumber();
  if (val < 1) precision = 4;
  return round(val, precision).toFixed(precision);
};

export default function({ vault, showSidebar, account, network, cdpOwner }) {
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();
  const { trackBtnClick } = useAnalytics('CollateralView');
  let {
    debtValue,
    collateralAmount,
    collateralValue,
    collateralTypePrice,
    collateralizationRatio,
    liquidationPrice,
    collateralAvailableAmount,
    collateralAvailableValue,
    daiAvailable,
    vaultType,
    unlockedCollateral,
    liquidationRatioSimple,
    liquidationPenalty,
    annualStabilityFee
  } = vault;

  log(`Rendering vault #${vault.id}`);

  const gem = collateralAmount?.symbol;

  //TODO find better ways to transform the return values into desired display values
  debtValue = formatValue(debtValue, 2);
  collateralAmount = formatValue(collateralAmount, 2);
  collateralValue = formatValue(collateralValue, 2);
  collateralTypePrice = formatValue(collateralTypePrice, 2);
  collateralizationRatio = (
    formatValue(collateralizationRatio, 4) * 100
  ).toFixed(2); //note special attn: must mul to get a %
  liquidationPrice = formatValue(liquidationPrice, 2);
  collateralAvailableAmount = formatValue(collateralAvailableAmount, 2);
  collateralAvailableValue = formatValue(collateralAvailableValue, 2);
  daiAvailable = formatValue(daiAvailable, 2);
  liquidationRatioSimple = formatValue(liquidationRatioSimple, 4) * 100; //note special attn: must mul to get a %
  liquidationPenalty = (formatValue(liquidationPenalty, 4) * 100).toFixed(2); //note special attn: mul & toFixed
  annualStabilityFee = (formatValue(annualStabilityFee, 4) * 100).toFixed(2); //note special attn: mul & toFixed

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const eventHistory = FF_VAULT_HISTORY ? useEventHistory(vault.id) : null;

  if (['Infinity', Infinity, 'NaN'].includes(liquidationPrice))
    liquidationPrice = lang.cdp_page.not_applicable;
  if (['Infinity', Infinity, 'NaN'].includes(collateralizationRatio))
    collateralizationRatio = lang.cdp_page.not_applicable;
  const isOwner =
    account && account.address.toLowerCase() === cdpOwner.toLowerCase();

  const [actionShown, setActionShown] = useState(null);
  const { addNotification, deleteNotifications } = useNotification();

  useEffect(() => {
    const reclaimCollateral = async () => {
      const txObject = maker
        .service('mcd:cdpManager')
        .reclaimCollateral(vault.id, unlockedCollateral.toFixed());
      newTxListener(txObject, lang.transactions.claiming_collateral);
      await txObject;
      deleteNotifications([NotificationList.CLAIM_COLLATERAL]);
    };

    if (isOwner && unlockedCollateral > 0) {
      const claimCollateralNotification = lang.formatString(
        lang.notifications.claim_collateral,
        gem,
        unlockedCollateral && formatValue(unlockedCollateral, 2),
        gem
      );

      addNotification({
        id: NotificationList.CLAIM_COLLATERAL,
        content: claimCollateralNotification,
        level: SAFETY_LEVELS.WARNING,
        hasButton: isOwner,
        buttonLabel: lang.notifications.claim,
        onClick: () => reclaimCollateral()
      });
    }

    if (!isOwner && account) {
      addNotification({
        id: NotificationList.NON_VAULT_OWNER,
        content: lang.formatString(
          lang.notifications.non_vault_owner,
          <Address full={cdpOwner} shorten={true} expandable={false} />
        ),
        level: SAFETY_LEVELS.WARNING
      });
    }

    return () =>
      deleteNotifications([
        NotificationList.CLAIM_COLLATERAL,
        NotificationList.NON_VAULT_OWNER
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner, account, vault, unlockedCollateral]);

  const showAction = props => {
    const emSize = parseInt(getComputedStyle(document.body).fontSize);
    const pxBreakpoint = parseInt(theme.breakpoints.l) * emSize;
    const isMobile = document.documentElement.clientWidth < pxBreakpoint;
    if (isMobile) {
      setActionShown(props);
    } else {
      showSidebar(props);
    }
  };

  return (
    <PageContentLayout>
      <Box>
        <Text.h2>
          {vaultType} {lang.cdp} #{vault.id}
        </Text.h2>
      </Box>
      <Grid
        py="m"
        gridColumnGap="l"
        gridTemplateColumns={{
          0: '1fr',
          1: '1fr',
          xl: '1fr 1fr'
        }}
      >
        <CdpViewCard title={lang.cdp_page.liquidation_price}>
          <Flex alignItems="flex-end" mt="s" mb="xs">
            <AmountDisplay amount={liquidationPrice} denomination="USD" />
            <ExtraInfo>({gem}/USD)</ExtraInfo>
          </Flex>
          <InfoContainerRow
            title={
              <TextBlock fontSize="l">
                {lang.cdp_page.current_price_info}
                <ExtraInfo ml="2xs">{`(${gem}/USD)`}</ExtraInfo>
              </TextBlock>
            }
            value={`${collateralTypePrice} USD`}
          />
          <InfoContainerRow
            title={lang.cdp_page.liquidation_penalty}
            value={liquidationPenalty + '%'}
          />
        </CdpViewCard>

        <CdpViewCard title={lang.cdp_page.collateralization_ratio}>
          <Flex alignItems="flex-end" mt="s" mb="xs">
            <AmountDisplay amount={collateralizationRatio} denomination="%" />
          </Flex>
          <InfoContainerRow
            title={lang.cdp_page.minimum_ratio}
            value={liquidationRatioSimple + '.00%'}
          />
          <InfoContainerRow
            title={lang.cdp_page.stability_fee}
            value={annualStabilityFee + '%'}
          />
        </CdpViewCard>

        <CdpViewCard title={`${gem} ${lang.cdp_page.locked.toLowerCase()}`}>
          <ActionContainerRow
            title={`${gem} ${lang.cdp_page.locked.toLowerCase()}`}
            value={`${collateralAmount} ${gem}`}
            conversion={`${collateralValue} USD`}
            button={
              <ActionButton
                disabled={!account}
                onClick={() => {
                  trackBtnClick('Deposit');
                  showAction({
                    type: 'deposit',
                    props: { cdpId: vault.id, vault }
                  });
                }}
              >
                {lang.actions.deposit}
              </ActionButton>
            }
          />
          <ActionContainerRow
            title={lang.cdp_page.able_withdraw}
            value={`${collateralAvailableAmount} ${gem}`}
            conversion={`${collateralAvailableValue} USD`}
            button={
              <ActionButton
                disabled={!account || !isOwner}
                onClick={() => {
                  trackBtnClick('Withdraw');
                  showAction({
                    type: 'withdraw',
                    props: { cdpId: vault.id, vault }
                  });
                }}
              >
                {lang.actions.withdraw}
              </ActionButton>
            }
          />
        </CdpViewCard>

        <CdpViewCard title={lang.cdp_page.outstanding_dai_debt}>
          <ActionContainerRow
            title={lang.cdp_page.outstanding_dai_debt}
            value={debtValue + ' DAI'}
            button={
              <ActionButton
                disabled={!account}
                onClick={() => {
                  trackBtnClick('Payback');
                  showAction({
                    type: 'payback',
                    props: { cdpId: vault.id, vault }
                  });
                }}
              >
                {lang.actions.pay_back}
              </ActionButton>
            }
          />
          <ActionContainerRow
            title={lang.cdp_page.available_generate}
            value={`${daiAvailable} DAI`}
            button={
              <ActionButton
                disabled={!account || !isOwner}
                onClick={() => {
                  trackBtnClick('Generate');
                  showAction({
                    type: 'generate',
                    props: { cdpId: vault.id, vault }
                  });
                }}
              >
                {lang.actions.generate}
              </ActionButton>
            }
          />
        </CdpViewCard>
      </Grid>

      {FF_VAULT_HISTORY && (
        <History
          title={lang.cdp_page.tx_history}
          rows={eventHistory}
          network={network}
          isLoading={eventHistory === null}
        />
      )}

      {actionShown && (
        <FullScreenAction {...actionShown} reset={() => setActionShown(null)} />
      )}
    </PageContentLayout>
  );
}
