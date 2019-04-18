import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import PageContentLayout from 'layouts/PageContentLayout';
import LoadingLayout from 'layouts/LoadingLayout';
import lang from 'languages';
import {
  getUsdPrice,
  getLockedAndFreeCollateral,
  calcCDPParams
} from 'utils/cdp';
import {
  Box,
  Grid,
  Flex,
  Card,
  Button,
  Table,
  Text
} from '@makerdao/ui-components-core';
import { Title, TextBlock } from 'components/Typography';
import useMaker from 'hooks/useMaker';
import useSidebar from 'hooks/useSidebar';
import { getIlkData } from 'reducers/network/cdpTypes';
import ExternalLink from 'components/ExternalLink';
import { getColor } from '../styles/theme';

function CardTitle({ title, ...props }) {
  return (
    <TextBlock t="headingS" fontWeight="medium" {...props}>
      {title}
    </TextBlock>
  );
}

const WithSeperators = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid ${getColor('grayLight3')};
  }
`;

const InfoContainerRow = ({ title, value }) => {
  return (
    <WithSeperators>
      <Grid py="xs" gridTemplateColumns="1fr auto">
        <TextBlock color="text" fontSize="1.5rem">
          {title}
        </TextBlock>
        <TextBlock t="p3" color="text">
          {value}
        </TextBlock>
      </Grid>
    </WithSeperators>
  );
};

const ActionContainerRow = ({ title, value, conversion, button }) => {
  return (
    <WithSeperators>
      <Flex flexWrap="wrap" justifyContent="space-between" py="s">
        <Box alignSelf="center" width="140px">
          <TextBlock color="text" fontSize="1.5rem">
            {title}
          </TextBlock>
        </Box>

        <Box flexGrow="1">
          <Box display="flex">
            <Box flexGrow="1" />
            <Box alignSelf="center">
              <Flex flexDirection="column" width="150px" pr="m">
                <TextBlock
                  t="p2"
                  fontWeight="medium"
                  color="text"
                  textAlign="right"
                >
                  {value}
                </TextBlock>
                <ExtraInfo textAlign="right">{conversion}</ExtraInfo>
              </Flex>
            </Box>
            <Box alignSelf="center">{button}</Box>
          </Box>
        </Box>
      </Flex>
    </WithSeperators>
  );
};

const ActionButton = ({ children, ...props }) => (
  <Button width="100px" p="xs" variant="secondary" {...props}>
    <TextBlock t="p5" color="black4">
      {children}
    </TextBlock>
  </Button>
);

const CdpViewCard = ({ title, children }) => {
  return (
    <Box my="s">
      <CardTitle title={title} />
      <Card px="l" pt="m" pb="s" my="s">
        {children}
      </Card>
    </Box>
  );
};

const AmountDisplay = ({ amount, denomination }) => {
  return (
    <>
      <TextBlock t="headingM" lineHeight="1" fontWeight="medium">
        {amount}&nbsp;
      </TextBlock>
      <TextBlock fontSize="1.6rem" fontWeight="medium">
        {denomination} &nbsp;
      </TextBlock>
    </>
  );
};

const ExtraInfo = ({ children, ...props }) => {
  return (
    <Text fontSize="1.4rem" color="steel" {...props}>
      {children}
    </Text>
  );
};

const CdpViewHistory = ({ title, rows }) => {
  return (
    <Box>
      <CardTitle title={title} />
      <Card px="m" py="s" my="s">
        <Table width="100%" variant="normal">
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
                  <td>{collateralType}</td>
                  <td>{actionMsg}</td>
                  <td>{dateOfAction}</td>
                  <td>{senderId}</td>
                  <td>{txHash}</td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </Card>
    </Box>
  );
};

function CDPView({ cdpId, getIlk }) {
  const { maker, account } = useMaker();
  const { show: showSidebar } = useSidebar();

  // TODO cdpTypeSlug should become `id` or we should have both cdpTypeSlug AND id.
  const [cdp, setCDP] = useState(null);

  useEffect(() => {
    (async () => {
      const cdpManager = maker.service('mcd:cdpManager');
      const cdp = await cdpManager.getCdp(parseInt(cdpId));
      const ilkData = getIlk(cdp.ilk);
      const debt = await cdp.getDebtValue();
      const collateral = await cdp.getCollateralValue();
      setCDP({
        ...cdp,
        ilkData,
        debt,
        collateral
      });
    })();
  }, [cdpId, getIlk, maker]);

  if (!cdp) return <LoadingLayout background={getColor('grayLight5')} />;

  const collateralInt = cdp.collateral.toNumber();
  const collateralDenomination = cdp.ilkData.gem;
  const debtInt = cdp.debt.toNumber();
  const collateralPrice = getUsdPrice(cdp.ilkData);
  const {
    liquidationPrice,
    collateralizationRatio,
    daiAvailable
  } = calcCDPParams({
    ilkData: cdp.ilkData,
    gemsToLock: collateralInt,
    daiToDraw: debtInt
  });
  const stabilityFee = parseFloat(cdp.ilkData.rate) * 100 + '%';
  const {
    locked: lockedCollateral,
    free: freeCollateral
  } = getLockedAndFreeCollateral(cdp);
  const generateAmount = parseFloat(daiAvailable) - debtInt;
  // calls that will come from the mcd-plugin once functionality is implemented.
  // cdpState.getCollateralizationRatio().then((val, err) => console.log(val, err))
  // cdpState.getLiquidationPrice().then((val, err) => console.log(val, err))

  const mockAddr = '0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF';
  return (
    <PageContentLayout>
      <Box>
        <Title color="black2">
          {lang.cdp} {cdpId}
        </Title>
      </Box>
      <Grid
        py="m"
        gridColumnGap="l"
        gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}
      >
        <CdpViewCard title={lang.cdp_page.liquidation_price}>
          <Flex alignItems="flex-end" mb="xs">
            <AmountDisplay
              amount={liquidationPrice.toFixed(2)}
              denomination="USD"
            />
            <ExtraInfo>(${cdp.ilk}/USD)</ExtraInfo>
          </Flex>
          <InfoContainerRow
            title={
              <TextBlock>
                {lang.cdp_page.current_price_info}
                <ExtraInfo ml="s">(ETH/USD)</ExtraInfo>
              </TextBlock>
            }
            value={collateralPrice.toFixed(2)}
          />
          <InfoContainerRow
            title={lang.cdp_page.liquidation_penalty}
            value={cdp.ilkData.liquidationPenalty + '%'}
          />
        </CdpViewCard>

        <CdpViewCard title={lang.cdp_page.collateralization_ratio}>
          <Flex alignItems="flex-end" mb="xs">
            <AmountDisplay
              amount={
                collateralizationRatio &&
                parseFloat(collateralizationRatio).toFixed(2)
              }
              denomination="%"
            />
          </Flex>
          <InfoContainerRow
            title={lang.cdp_page.minimum_ratio}
            value={cdp.ilkData.liquidationRatio + '.00%'}
          />
          <InfoContainerRow
            title={lang.cdp_page.stability_fee}
            value={stabilityFee}
          />
        </CdpViewCard>

        <CdpViewCard title={`${cdpId} ${lang.cdp_page.collateral}`}>
          <Flex alignItems="flex-end" mb="xs">
            <AmountDisplay
              amount={cdp.collateral.toNumber().toFixed(2)}
              denomination={cdp.collateral.symbol}
            />
            <ExtraInfo>{`${(collateralPrice * collateralInt).toFixed(
              2
            )} USD`}</ExtraInfo>
          </Flex>
          <ActionContainerRow
            title={lang.cdp_page.locked}
            value={`${lockedCollateral &&
              lockedCollateral.toFixed(2)} ${collateralDenomination}`}
            conversion={`${(lockedCollateral * collateralPrice).toFixed(
              2
            )} USD`}
            button={
              <ActionButton
                disabled={!account}
                onClick={() =>
                  showSidebar({
                    sidebarType: 'deposit',
                    sidebarProps: { cdp }
                  })
                }
              >
                {lang.actions.deposit}
              </ActionButton>
            }
          />
          <ActionContainerRow
            title={lang.cdp_page.able_withdraw}
            value={`${freeCollateral &&
              freeCollateral.toFixed(2)} ${collateralDenomination}`}
            conversion={`${(freeCollateral * collateralPrice).toFixed(2)} USD`}
            button={
              <ActionButton
                disabled={!account}
                onClick={() =>
                  showSidebar({
                    sidebarType: 'withdraw',
                    sidebarProps: { cdp }
                  })
                }
              >
                {lang.actions.withdraw}
              </ActionButton>
            }
          />
        </CdpViewCard>

        <CdpViewCard title={`DAI ${lang.cdp_page.position}`}>
          <Flex alignItems="flex-end" mb="xs">
            <AmountDisplay
              amount={cdp.debt.toNumber().toFixed(2)}
              denomination={cdp.debt.symbol}
            />
            <ExtraInfo>{lang.cdp_page.outstanding_debt}</ExtraInfo>
          </Flex>
          <ActionContainerRow
            title={`DAI ${lang.cdp_page.wallet_balance}`}
            value={`${debtInt && debtInt.toFixed(2)} DAI`}
            conversion={`${debtInt && debtInt.toFixed(2)} USD`}
            button={
              <ActionButton
                disabled={!account}
                onClick={() =>
                  showSidebar({
                    sidebarType: 'payback',
                    sidebarProps: { cdp }
                  })
                }
              >
                {lang.actions.pay_back}
              </ActionButton>
            }
          />
          <ActionContainerRow
            title={lang.cdp_page.able_generate}
            value={`${generateAmount && generateAmount.toFixed(2)} DAI`}
            conversion={`${generateAmount && generateAmount.toFixed(2)} USD`}
            button={
              <ActionButton
                disabled={!account}
                onClick={() =>
                  showSidebar({
                    sidebarType: 'generate',
                    sidebarProps: { cdp }
                  })
                }
              >
                {lang.actions.generate}
              </ActionButton>
            }
          />
        </CdpViewCard>
      </Grid>

      <CdpViewHistory
        title={lang.cdp_page.tx_history}
        rows={[
          [
            'ETH',
            'Paid back 1,000.00 DAI',
            'Feb 15, 2019',
            <ExternalLink address={mockAddr} network={'kovan'} />,
            <ExternalLink address={mockAddr} network={'kovan'} />
          ],
          [
            'ETH',
            'Sent 1,000.00 DAI',
            'Feb 12, 2019',
            <ExternalLink address={mockAddr} network={'kovan'} />,
            <ExternalLink address={mockAddr} network={'kovan'} />
          ],
          [
            'ETH',
            'Locked 1,000.00 DAI',
            'Feb 09, 2019',
            <ExternalLink address={mockAddr} network={'kovan'} />,
            <ExternalLink address={mockAddr} network={'kovan'} />
          ],
          [
            'ETH',
            'Withdrew 3,468.72 ETH',
            'Feb 03, 2019',
            <ExternalLink address={mockAddr} network={'kovan'} />,
            <ExternalLink address={mockAddr} network={'kovan'} />
          ],
          [
            'ETH',
            'Opened CDP',
            'Jan 15, 2019',
            <ExternalLink address={mockAddr} network={'kovan'} />,
            <ExternalLink address={mockAddr} network={'kovan'} />
          ]
        ]}
      />
    </PageContentLayout>
  );
}

function mapStateToProps(state) {
  return {
    getIlk: key => getIlkData(state, key)
  };
}

export default hot(connect(mapStateToProps)(CDPView));
