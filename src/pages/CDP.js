import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
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
import { getIlkData } from 'reducers/network/cdpTypes';
import ExternalLink from 'components/ExternalLink';
import { getColor } from '../styles/theme';

const WithSeperators = styled(Box).attrs(() => ({
  borderBottom: '1px solid',
  borderColor: 'grey.300'
}))`
  &:last-child {
    border-bottom: none;
  }
`;

const InfoContainerRow = ({ title, value }) => {
  return (
    <WithSeperators>
      <Grid py="xs" gridTemplateColumns="1fr auto">
        <TextBlock t="body">{title}</TextBlock>
        <TextBlock t="body">{value}</TextBlock>
      </Grid>
    </WithSeperators>
  );
};

const ActionContainerRow = ({ title, value, conversion, button }) => {
  return (
    <WithSeperators>
      <Flex flexWrap="wrap" justifyContent="space-between" py="s">
        <Box alignSelf="center" width="140px">
          <TextBlock color="darkLavender" fontSize="m">
            {title}
          </TextBlock>
        </Box>

        <Box flexGrow="1">
          <Box display="flex">
            <Box flexGrow="1" />
            <Box alignSelf="center">
              <Flex flexDirection="column" width="150px" pr="m">
                <TextBlock
                  t="h5"
                  lineHeight="normal"
                  fontWeight="medium"
                  color="darkLavender"
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
    <TextBlock fontSize="s" color="darkLavender">
      {children}
    </TextBlock>
  </Button>
);

const CdpViewCard = ({ title, children }) => {
  return (
    <Box my="s">
      <Text.h4>{title}</Text.h4>
      <Card px="l" pt="m" pb="s" my="s">
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
  const [daiBalance, setDaiBalance] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setDaiBalance(await maker.getToken('MDAI').balance());
      } catch (err) {
        console.error(
          `Unable to fetch dai balance, no account is currently connected`
        );
      }
    })();
  }, [account]);

  useEffect(() => {
    (async () => {
      const cdpManager = maker.service('mcd:cdpManager');
      const cdp = await cdpManager.getCdp(parseInt(cdpId));
      const ilkData = getIlk(cdp.ilk);
      window.cdp = cdp;
      const [
        debt,
        collateral,
        collateralPrice,
        collateralizationRatio,
        liquidationPrice,
        daiAvailable,
        minCollateral,
        freeCollateral
      ] = await Promise.all([
        cdp.getDebtValue(),
        cdp.getCollateralAmount(),
        cdp.type.getPrice(),
        cdp.getCollateralizationRatio(),
        cdp.getLiquidationPrice(),
        cdp.daiAvailable(),
        cdp.getMinCollateralAmount(),
        cdp.getCollateralAvailable()
      ]);
      setCDP({
        cdp,
        ilkData,
        debt,
        collateral,
        collateralPrice,
        collateralizationRatio,
        liquidationPrice,
        daiAvailable,
        minCollateral,
        freeCollateral
      });
    })();
  }, [cdpId, getIlk, maker]);

  if (!cdp) return <LoadingLayout />;
  const mockAddr = '0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF';
  window.test = cdp;
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
          <Flex alignItems="flex-end" mb="xs">
            <AmountDisplay
              amount={cdp.liquidationPrice.toNumber().toFixed(2)}
              denomination="USD"
            />
            <ExtraInfo>({cdp.ilkData.gem}/USD)</ExtraInfo>
          </Flex>
          <InfoContainerRow
            title={
              <TextBlock>
                {lang.cdp_page.current_price_info}
                <ExtraInfo ml="s">{`(${cdp.ilkData.gem}/USD)`}</ExtraInfo>
              </TextBlock>
            }
            value={cdp.collateralPrice.toFixed(2) / 100}
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
                cdp.collateralizationRatio &&
                (parseFloat(cdp.collateralizationRatio) * 100).toFixed(2)
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
            value={cdp.ilkData.rate * 100 + '%'}
          />
        </CdpViewCard>

        <CdpViewCard title={`${cdpId} ${lang.cdp_page.collateral}`}>
          <Flex alignItems="flex-end" mb="xs">
            <AmountDisplay
              amount={cdp.collateral.toNumber().toFixed(2)}
              denomination={cdp.collateral.symbol}
            />
            <ExtraInfo>{`${(
              cdp.collateralPrice.toNumber() * cdp.collateral.toNumber()
            ).toFixed(2)} USD`}</ExtraInfo>
          </Flex>
          <ActionContainerRow
            title={lang.cdp_page.locked}
            value={`${cdp.minCollateral &&
              cdp.minCollateral.toFixed(2) / 100} ${cdp.ilkData.gem}`}
            conversion={`${cdp.minCollateral
              .times(cdp.collateralPrice)
              .toFixed(2) / 100} USD`}
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
            value={`${cdp.freeCollateral && cdp.freeCollateral.toFixed(2)} ${
              cdp.ilkData.gem
            }`}
            conversion={`${cdp.freeCollateral
              .times(cdp.collateralPrice)
              .toFixed(2) / 100} USD`}
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
          {cdp.debt ? (
            <ActionContainerRow
              title={`DAI ${lang.cdp_page.wallet_balance}`}
              value={`${cdp.debt.toNumber().toFixed(2)} DAI`}
              conversion={`${cdp.debt.toNumber().toFixed(2)} USD`}
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
          ) : null}
          <ActionContainerRow
            title={lang.cdp_page.able_generate}
            value={`${cdp.daiAvailable &&
              cdp.daiAvailable.toFixed(2) / 100} DAI`}
            conversion={`${cdp.daiAvailable &&
              cdp.daiAvailable.toFixed(2) / 100} USD`}
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
