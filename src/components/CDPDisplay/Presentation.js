import React, { useEffect, useState } from 'react';
import useLanguage from 'hooks/useLanguage';
import useEventHistory from 'hooks/useEventHistory';
import useMaker from 'hooks/useMaker';
import { TextBlock } from 'components/Typography';
import PageContentLayout from 'layouts/PageContentLayout';
import {
  getDebtAmount,
  getLiquidationPrice,
  getCollateralPrice,
  getCollateralAmount,
  getCollateralValueUSD,
  getCollateralizationRatio,
  getCollateralAvailableAmount,
  getCollateralAvailableValue,
  getDaiAvailable,
  getUnlockedCollateralAmount
} from 'reducers/cdps';
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
import { FeatureFlags } from '../../utils/constants';
import theme from '../../styles/theme';
import FullScreenAction from './FullScreenAction';
import debug from 'debug';
import useNotification from 'hooks/useNotification';
import { NotificationStatus, NotificationList } from 'utils/constants';
import { Address } from '@makerdao/ui-components-core';

const log = debug('maker:CDPDisplay/Presentation');
const { FF_VAULTHISTORY } = FeatureFlags;

export default function({ cdp, showSidebar, account, network, cdpOwner }) {
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();

  const cdpId = parseInt(cdp.id);
  const eventHistory = useEventHistory(cdpId);
  log(`Rendering vault #${cdpId}`);
  const gem = cdp.currency.symbol;
  const debtAmount = getDebtAmount(cdp);
  let liquidationPrice = getLiquidationPrice(cdp);
  if (liquidationPrice) liquidationPrice = liquidationPrice.toFixed(2);
  if (liquidationPrice === 'Infinity')
    liquidationPrice = lang.cdp_page.not_applicable;
  const collateralPrice = getCollateralPrice(cdp);
  const collateralAmount = getCollateralAmount(cdp);
  const collateralUSDValue = getCollateralValueUSD(cdp);
  let collateralizationRatio = getCollateralizationRatio(cdp);
  if (collateralizationRatio === Infinity)
    collateralizationRatio = lang.cdp_page.not_applicable;
  const collateralAvailableAmount = getCollateralAvailableAmount(cdp);
  const collateralAvailableValue = getCollateralAvailableValue(cdp);
  const daiAvailable = getDaiAvailable(cdp);
  const isOwner = account && account.address === cdpOwner;

  const [actionShown, setActionShown] = useState(null);
  const { addNotification, deleteNotifications } = useNotification();

  const unlockedCollateral = getUnlockedCollateralAmount(cdp, false);

  useEffect(() => {
    const reclaimCollateral = async () => {
      const txObject = maker
        .service('mcd:cdpManager')
        .reclaimCollateral(cdpId, unlockedCollateral.toNumber(), 0);
      newTxListener(txObject, 'Claiming collateral');
    };

    if (isOwner && unlockedCollateral > 0) {
      const claimCollateralNotification = lang.formatString(
        lang.notifications.claim_collateral,
        cdp.gem,
        cdp.unlockedCollateral && cdp.unlockedCollateral.toFixed(7),
        cdp.gem
      );

      addNotification({
        id: NotificationList.CLAIM_COLLATERAL,
        content: claimCollateralNotification,
        status: NotificationStatus.WARNING,
        hasButton: isOwner,
        buttonLabel: 'Claim',
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
        status: NotificationStatus.WARNING
      });
    }

    return () =>
      deleteNotifications([
        NotificationList.CLAIM_COLLATERAL,
        NotificationList.NON_VAULT_OWNER
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner, account, cdpId, unlockedCollateral]);

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
          {cdp.ilk} {lang.cdp} #{cdpId}
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
            value={`${collateralPrice} USD`}
          />
          <InfoContainerRow
            title={lang.cdp_page.liquidation_penalty}
            value={cdp.liquidationPenalty + '%'}
          />
        </CdpViewCard>

        <CdpViewCard title={lang.cdp_page.collateralization_ratio}>
          <Flex alignItems="flex-end" mt="s" mb="xs">
            <AmountDisplay amount={collateralizationRatio} denomination="%" />
          </Flex>
          <InfoContainerRow
            title={lang.cdp_page.minimum_ratio}
            value={cdp.liquidationRatio + '.00%'}
          />
          <InfoContainerRow
            title={lang.cdp_page.stability_fee}
            value={cdp.stabilityFee + '%'}
          />
        </CdpViewCard>

        <CdpViewCard title={`${gem} ${lang.cdp_page.locked.toLowerCase()}`}>
          <ActionContainerRow
            title={`${gem} ${lang.cdp_page.locked.toLowerCase()}`}
            value={`${collateralAmount} ${gem}`}
            conversion={`${collateralUSDValue} USD`}
            button={
              <ActionButton
                disabled={!account}
                onClick={() =>
                  showAction({ type: 'deposit', props: { cdpId } })
                }
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
                onClick={() =>
                  showAction({ type: 'withdraw', props: { cdpId } })
                }
              >
                {lang.actions.withdraw}
              </ActionButton>
            }
          />
        </CdpViewCard>

        <CdpViewCard title={lang.cdp_page.outstanding_dai_debt}>
          <ActionContainerRow
            title={lang.cdp_page.outstanding_dai_debt}
            value={debtAmount + ' DAI'}
            button={
              <ActionButton
                disabled={!account}
                onClick={() =>
                  showAction({ type: 'payback', props: { cdpId } })
                }
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
                onClick={() =>
                  showAction({ type: 'generate', props: { cdpId } })
                }
              >
                {lang.actions.generate}
              </ActionButton>
            }
          />
        </CdpViewCard>
      </Grid>

      {FF_VAULTHISTORY && (
        <History
          title={lang.cdp_page.tx_history}
          rows={eventHistory}
          network={network}
        />
      )}

      {actionShown && (
        <FullScreenAction {...actionShown} reset={() => setActionShown(null)} />
      )}
    </PageContentLayout>
  );
}
