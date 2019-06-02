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
  getDaiAvailable
} from 'reducers/cdps';
import { trackCdpById } from 'reducers/multicall/cdps';

import ExternalLink from 'components/ExternalLink';

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
      <Flex py="xs" justifyContent="space-between" flexWrap="wrap">
        <Box>
          <TextBlock fontSize="l" width="270px">
            {title}
          </TextBlock>
        </Box>
        <Box flexGrow="1">
          <Box display="flex">
            <Box flexGrow={['0', '1', '1']} />
            <TextBlock
              fontSize="l"
              width="110px"
              textAlign={['left', 'right', 'right']}
            >
              {value}
            </TextBlock>
            <Box flexGrow={['1', '0', '0']} />
          </Box>
        </Box>
      </Flex>
    </WithSeparators>
  );
};

const ActionContainerRow = ({ title, value, conversion, button }) => {
  return (
    <WithSeparators>
      <Flex flexWrap="wrap" justifyContent="space-between" py="s">
        <Box alignSelf="center" maxWidth="33%">
          <TextBlock color="darkLavender" fontSize="l">
            {title}
          </TextBlock>
        </Box>
        <Box flexGrow="1">
          <Box display="flex">
            <Box flexGrow={['0', '1', '1']} />
            <Flex flexDirection="column" pr="m" alignSelf="center">
              <TextBlock
                width="90px"
                t="h5"
                lineHeight="normal"
                fontWeight="medium"
                color="darkLavender"
                textAlign={['left', 'right', 'right']}
              >
                {value}
              </TextBlock>
              {conversion ? (
                <ExtraInfo textAlign={['left', 'right', 'right']}>
                  {conversion}
                </ExtraInfo>
              ) : null}
            </Flex>
            <Box flexGrow={['1', '0', '0']} />
            <Box alignSelf="center">{button}</Box>
          </Box>
        </Box>
      </Flex>
    </WithSeparators>
  );
};

const ActionButton = ({ children, ...props }) => (
  <Button width="100px" p="xs" variant="secondary" {...props}>
    <TextBlock fontSize="s" fontWeight="medium" color="darkLavender">
      {children}
    </TextBlock>
  </Button>
);

const CdpViewCard = ({ title, children }) => {
  return (
    <Box my="s">
      <Text.h4>{title}</Text.h4>
      <Card px="l" pt="s" pb="s" my="s">
        {children}
      </Card>
    </Box>
  );
};

const AmountDisplay = ({ amount, denomination }) => {
  return (
    <>
      <TextBlock t="h3" lineHeight="1">
        {amount}&nbsp;
      </TextBlock>
      <TextBlock t="h5">{denomination} &nbsp;</TextBlock>
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
  const { maker, account } = useMaker();
  const { show: showSidebar } = useSidebar();
  const [{ cdps, feeds }] = useStore();
  const cdp = useMemo(() => getCdp(cdpId, { cdps, feeds }), [
    cdpId,
    cdps,
    feeds
  ]);

  useEffect(() => {
    trackCdpById(maker, cdpId);
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
        />
      ) : (
        <LoadingLayout />
      ),
    [cdp, showSidebar, cdps, account]
  );
}

function CDPViewPresentation({ cdpId, cdp, showSidebar, account, owner }) {
  const gem = cdp.currency.symbol;
  const debtAmount = getDebtAmount(cdp);
  const liquidationPrice = getLiquidationPrice(cdp);
  const collateralPrice = getCollateralPrice(cdp);
  const collateralAmount = getCollateralAmount(cdp);
  const collateralUSDValue = getCollateralValueUSD(cdp);
  const collateralizationRatio = getCollateralizationRatio(cdp);
  const collateralAvailableAmount = getCollateralAvailableAmount(cdp);
  const collateralAvailableValue = getCollateralAvailableValue(cdp);
  const daiAvailable = getDaiAvailable(cdp);

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
                <ExtraInfo ml="s">{`(${gem}/USD)`}</ExtraInfo>
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

      <CdpViewHistory title={lang.cdp_page.tx_history} rows={mockHistoryData} />
    </PageContentLayout>
  );
}

export default hot(CDPView);

const mockAddr = '0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF';
const mockHistoryData = [
  [
    'ETH',
    'Paid back 1,000.00 DAI',
    'Feb 15, 2019',
    <ExternalLink key={1} address={mockAddr} network={'kovan'} />,
    <ExternalLink key={2} address={mockAddr} network={'kovan'} />
  ],
  [
    'ETH',
    'Sent 1,000.00 DAI',
    'Feb 12, 2019',
    <ExternalLink key={1} address={mockAddr} network={'kovan'} />,
    <ExternalLink key={2} address={mockAddr} network={'kovan'} />
  ],
  [
    'ETH',
    'Locked 1,000.00 DAI',
    'Feb 09, 2019',
    <ExternalLink key={1} address={mockAddr} network={'kovan'} />,
    <ExternalLink key={2} address={mockAddr} network={'kovan'} />
  ],
  [
    'ETH',
    'Withdrew 3,468.72 ETH',
    'Feb 03, 2019',
    <ExternalLink key={1} address={mockAddr} network={'kovan'} />,
    <ExternalLink key={2} address={mockAddr} network={'kovan'} />
  ],
  [
    'ETH',
    'Opened CDP',
    'Jan 15, 2019',
    <ExternalLink key={1} address={mockAddr} network={'kovan'} />,
    <ExternalLink key={2} address={mockAddr} network={'kovan'} />
  ]
];
