import React, { useEffect, useState } from 'react';
import round from 'lodash/round';
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
import { FeatureFlags } from '../../utils/constants';
import theme from '../../styles/theme';
import FullScreenAction from './FullScreenAction';
import debug from 'debug';
import useNotification from 'hooks/useNotification';
import { NotificationList, SAFETY_LEVELS } from 'utils/constants';
import { Address } from '@makerdao/ui-components-core';
import { watch } from 'hooks/useObservable';

const log = debug('maker:CDPDisplay/Presentation');
const { FF_VAULT_HISTORY } = FeatureFlags;

const formatValue = (val, precision) => {
  console.log('typeof val', typeof val);
  if (!val || val === undefined || typeof val !== 'object') return;
  if (val < 1) precision = 4;
  return round(val.toNumber(), precision).toFixed(precision);
};

export default function({ cdpId, showSidebar, account, network, cdpOwner }) {
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();
  const manager = maker
    .service('smartContract')
    .getContractAddress('CDP_MANAGER');

  // Testing:
  const dsProxy = watch.proxyAddress(account?.address);
  const getVaults = watch.getVaults(manager, dsProxy);
  const ilkPrice = watch.collateralTypePrice('ETH-A');
  // const cdpIds = useObservable('cdpIds', manager, dsProxy);
  // const cdpIlks = useObservable('cdpIlks', manager, dsProxy);
  // const cdpUrns = useObservable('cdpUrns', manager, dsProxy);
  // const liquidationRatio = useObservable('liquidationRatio', 'ETH-A');
  // const priceFeedAddress = useObservable('priceFeedAddress', 'ETH-A');

  log(`Rendering vault #${cdpId}`);

  //TODO better way to deal with awaiting vals:
  const vault = watch.vault(cdpId) || {};
  console.log('^^vault', vault);
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
  const gem = collateralAmount?.symbol;

  //TODO find better ways to transform the return values into desired display values
  debtValue = formatValue(debtValue, 2);
  collateralAmount = formatValue(collateralAmount, 2);
  collateralValue = formatValue(collateralValue, 2);
  collateralTypePrice = formatValue(collateralTypePrice, 2);
  collateralizationRatio = formatValue(collateralizationRatio, 4) * 100; //note special attn: must mul to get a %
  liquidationPrice = formatValue(liquidationPrice, 2);
  collateralAvailableAmount = formatValue(collateralAvailableAmount, 2);
  collateralAvailableValue = formatValue(collateralAvailableValue, 2);
  daiAvailable = formatValue(daiAvailable, 2);
  liquidationRatioSimple = formatValue(liquidationRatioSimple, 4) * 100; //note special attn: must mul to get a %
  liquidationPenalty = (formatValue(liquidationPenalty, 4) * 100).toFixed(2); //note special attn: mul & toFixed
  annualStabilityFee = (formatValue(annualStabilityFee, 4) * 100).toFixed(2); //note special attn: mul & toFixed

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const eventHistory = FF_VAULT_HISTORY ? useEventHistory(cdpId) : null;

  if (['Infinity', Infinity].includes(liquidationPrice))
    liquidationPrice = lang.cdp_page.not_applicable;
  if (collateralizationRatio === Infinity)
    collateralizationRatio = lang.cdp_page.not_applicable;
  const isOwner = account && account.address === cdpOwner;

  const [actionShown, setActionShown] = useState(null);
  const { addNotification, deleteNotifications } = useNotification();

  useEffect(() => {
    const reclaimCollateral = async () => {
      const txObject = maker
        .service('mcd:cdpManager')
        .reclaimCollateral(cdpId, unlockedCollateral.toFixed());
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
        <pre>dsProxy: {dsProxy}</pre>
      </Box>
      <Box>
        <pre>ilkPrice: {`${ilkPrice}`}</pre>
      </Box>
      <Box>
        <pre>Vaults: {getVaults && JSON.stringify(getVaults, null, 2)}</pre>
      </Box>
      <Box>
        <Text.h2>
          {vaultType} {lang.cdp} #{cdpId}
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
            value={debtValue + ' DAI'}
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
