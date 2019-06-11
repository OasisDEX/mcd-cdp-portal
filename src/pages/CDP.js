import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import PageContentLayout from 'layouts/PageContentLayout';
import LoadingLayout from 'layouts/LoadingLayout';
import lang from 'languages';
import {
  Box,
  Grid,
  Flex,
  Card,
  Button,
  Table,
  Text
} from '@makerdao/ui-components-core';
import { TextBlock } from 'components/Typography';
import theme, { getColor } from 'styles/theme';
import useMaker from 'hooks/useMaker';
import useSidebar from 'hooks/useSidebar';
import useStore from 'hooks/useStore';
import {
  getCdp,
  getDebtAmount,
  getLiquidationPrice,
  getCollateralPrice,
  getCollateralAmount,
  getCollateralValueUSD,
  getCollateralizationRatio,
  getCollateralAvailableAmount,
  getCollateralAvailableValue,
  getDaiAvailable,
  getEventHistory
} from 'reducers/cdps';
import { trackCdpById } from 'reducers/multicall/cdps';

import ExternalLink from 'components/ExternalLink';
import { fullActivityString, formatDate } from 'utils/ui';

const mediumScreenMinBreakpoint = theme.breakpoints.xl;
const mediumScreenMaxBreakpoint = '1425px';

const mediaMediumScreen = `@media (min-width: ${mediumScreenMinBreakpoint}) and (max-width: ${mediumScreenMaxBreakpoint})`;

const WithSeparators = styled(Box).attrs(() => ({
  borderBottom: '1px solid',
  borderColor: 'grey.300'
}))`
  &:last-child {
    border-bottom: none;
  }
`;

const InfoContainerRow = ({ title, value }) => {
  return (
    <WithSeparators>
      <Grid
        gridTemplateColumns="1fr auto"
        py="xs"
        gridColumnGap="s"
        alignItems="center"
      >
        <Text t="body">{title}</Text>
        <Text t="body">{value}</Text>
      </Grid>
    </WithSeparators>
  );
};

const ActionContainerRow = ({ title, value, conversion, button }) => {
  return (
    <WithSeparators>
      <Grid
        py="s"
        gridTemplateColumns="1fr auto auto"
        alignItems="center"
        gridColumnGap="s"
        gridAutoRows="min-content"
        gridRowGap="2xs"
      >
        <Text
          css={`
            grid-column: 1;
            grid-row: span 2;

            ${mediaMediumScreen} {
              grid-row: 1;
              grid-column: span 3;
            }
          `}
          t="body"
        >
          {title}
        </Text>
        <Text
          css={`
            grid-column: 2;
            grid-row: ${conversion ? '1' : 'span 2'};

            ${mediaMediumScreen} {
              grid-row: 2;
            }
          `}
          t="h5"
          color="darkLavender"
          justifySelf="end"
        >
          {value}
        </Text>
        {conversion ? (
          <ExtraInfo
            css={`
              grid-row: 2;
              grid-column: 2;

              ${mediaMediumScreen} {
                grid-row: 3;
              }
            `}
            justifySelf="end"
          >
            {conversion}
          </ExtraInfo>
        ) : null}
        <Box
          css={`
            grid-column: 3;
            grid-row: span 2;

            ${mediaMediumScreen} {
              grid-row: ${conversion ? 'span 2' : '2'};
            }
          `}
        >
          {button}
        </Box>
      </Grid>
    </WithSeparators>
  );
};

const ActionButton = ({ children, ...props }) => (
  <Button width="100px" p="xs" variant="secondary" {...props}>
    <Text fontSize="s" fontWeight="medium" color="darkLavender">
      {children}
    </Text>
  </Button>
);

const CdpViewCard = ({ title, children }) => {
  return (
    <Flex py="s" height="100%" flexDirection="column">
      <Text.h4>{title}</Text.h4>
      <Card px={{ s: 'm', m: 'l' }} py="s" mt="s" flexGrow="1">
        {children}
      </Card>
    </Flex>
  );
};

const AmountDisplay = ({ amount, denomination }) => {
  return (
    <>
      <Text t="h3" lineHeight="1">
        {amount}&nbsp;
      </Text>
      <Text t="h5">{denomination} &nbsp;</Text>
    </>
  );
};

const ExtraInfo = ({ children, ...props }) => {
  return (
    <Text t="caption" lineHeight="none" color="steel" {...props}>
      {children}
    </Text>
  );
};

const CdpViewHistory = ({ title, rows }) => {
  return (
    <Box>
      <Text.h4>{title}</Text.h4>
      <Card px="l" pt="m" pb="l" my="s" css={{ overflowX: 'scroll' }}>
        <Table
          width="100%"
          variant="normal"
          css={`
            td,
            th {
              padding-right: 10px;
            }
          `}
        >
          <thead>
            <tr>
              <th>{lang.table.type}</th>
              <th>{lang.table.activity}</th>
              <th>{lang.table.time}</th>
              <th>{lang.table.sender_id}</th>
              <th>{lang.table.tx_hash}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(
              (
                [collateralType, actionMsg, dateOfAction, senderId, txHash],
                i
              ) => (
                <tr key={i}>
                  <td>
                    <Text color="darkPurple" t="body">
                      {collateralType}
                    </Text>
                  </td>
                  <td
                    css={`
                      white-space: nowrap;
                    `}
                  >
                    <Text color="darkLavender" t="caption">
                      {actionMsg}
                    </Text>
                  </td>
                  <td
                    css={`
                      white-space: nowrap;
                    `}
                  >
                    <Text color="darkLavender" t="caption">
                      {dateOfAction}
                    </Text>
                  </td>
                  <td>
                    <Text t="caption">{senderId}</Text>
                  </td>
                  <td>
                    <Text t="caption">{txHash}</Text>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </Card>
    </Box>
  );
};

function CDPView({ cdpId }) {
  cdpId = parseInt(cdpId, 10);
  const { maker, account, network } = useMaker();
  const { show: showSidebar } = useSidebar();
  const [{ cdps, feeds }, dispatch] = useStore();
  const cdp = useMemo(() => getCdp(cdpId, { cdps, feeds }), [
    cdpId,
    cdps,
    feeds
  ]);

  useEffect(() => {
    trackCdpById(maker, cdpId, dispatch);
  }, [cdpId, maker]);

  return useMemo(
    () =>
      cdp.inited ? (
        <CDPViewPresentation
          cdp={cdp}
          cdpId={cdpId}
          showSidebar={showSidebar}
          account={account}
          owner={account && account.cdps.some(userCdp => userCdp.id === cdpId)}
          network={network}
        />
      ) : (
        <LoadingLayout background={getColor('backgroundGrey')} />
      ),
    [cdp, cdpId, showSidebar, account]
  );
}

function formatEventHistory(events, network) {
  return events.map(e => {
    return [
      e.changeInCollateral.symbol,
      fullActivityString(e),
      formatDate(e.time),
      <ExternalLink key={1} string={e.senderAddress} network={network} />,
      <ExternalLink key={2} string={e.transactionHash} network={network} />
    ];
  });
}

function CDPViewPresentation({
  cdpId,
  cdp,
  showSidebar,
  account,
  owner,
  network
}) {
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
  const eventHistory = formatEventHistory(getEventHistory(cdp), network);

  return (
    <PageContentLayout>
      <Box>
        <Text.h2>
          {lang.cdp} {cdpId}
        </Text.h2>
      </Box>
      <Grid
        py="m"
        gridColumnGap="l"
        gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}
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
                  showSidebar({
                    sidebarType: 'deposit',
                    sidebarProps: { cdpId }
                  })
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
                disabled={!account || !owner}
                onClick={() =>
                  showSidebar({
                    sidebarType: 'withdraw',
                    sidebarProps: { cdpId }
                  })
                }
              >
                {lang.actions.withdraw}
              </ActionButton>
            }
          />
        </CdpViewCard>

        <CdpViewCard title={`DAI ${lang.cdp_page.position}`}>
          <ActionContainerRow
            title={lang.cdp_page.outstanding_dai_debt}
            value={debtAmount + ' DAI'}
            button={
              <ActionButton
                disabled={!account}
                onClick={() =>
                  showSidebar({
                    sidebarType: 'payback',
                    sidebarProps: { cdpId }
                  })
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
                disabled={!account || !owner}
                onClick={() =>
                  showSidebar({
                    sidebarType: 'generate',
                    sidebarProps: { cdpId }
                  })
                }
              >
                {lang.actions.generate}
              </ActionButton>
            }
          />
        </CdpViewCard>
      </Grid>

      <CdpViewHistory title={lang.cdp_page.tx_history} rows={eventHistory} />
    </PageContentLayout>
  );
}

export default hot(CDPView);
