import React, { useState, useEffect } from 'react';
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
  Table
} from '@makerdao/ui-components-core';
import { Title, TextBlock } from 'components/Typography';
import useMaker from 'hooks/useMaker';
import useSidebar from 'hooks/useSidebar';
import { getIlkData } from 'reducers/network/cdpTypes';
import ExternalLink from 'components/ExternalLink';

function CardTitle({ title }) {
  return (
    <TextBlock t="headingS" fontWeight="medium">
      {title}
    </TextBlock>
  );
}

const TopContainerRow = ({ props }) => {
  const [title, value] = props;
  const [titleText, titleCurrency] =
    typeof title === 'string' ? title.split(' ') : ['n/a', 'n/a'];
  return (
    <Flex flexWrap="wrap" alignItems="flex-end">
      <TextBlock t="headingL" fontWeight="medium">
        {titleText} &nbsp;
      </TextBlock>
      <TextBlock t="textL" fontWeight="medium">
        {titleCurrency} &nbsp;
      </TextBlock>
      <TextBlock m="m" t="textM" color="gray2">
        {value}
      </TextBlock>
    </Flex>
  );
};

const InfoContainerRow = ({ props }) => {
  const [title, value] = props;
  const [rowInfoTitle, ...rowInfoLabel] =
    typeof title === 'string' ? title.split(/( \()/g) : ['n/a', 'n/a'];
  return (
    <Flex py="xs" flexWrap="wrap">
      <Flex flexGrow="1">
        <TextBlock t="p3" color="black4">
          {rowInfoTitle}
        </TextBlock>
        <TextBlock t="p3" color="gray2">
          {rowInfoLabel}
        </TextBlock>
      </Flex>
      <Box>
        <TextBlock t="p2" color="black4">
          {value}
        </TextBlock>
      </Box>
    </Flex>
  );
};

const ActionContainerRow = ({ props }) => {
  const [title, value, conversion, button] = props;
  return (
    <Flex flexWrap="wrap" justifyContent="space-between" py="s">
      <Box alignSelf="center" width="140px">
        <TextBlock t="p3" color="black4">
          {title}
        </TextBlock>
      </Box>
      <Box flexGrow="1">
        <Box display="flex">
          <Box flexGrow="1" />
          <Box alignSelf="center">
            <Flex flexDirection="column" width="150px" pr="15px">
              <TextBlock t="p2" textAlign="right">
                {value}
              </TextBlock>
              <TextBlock t="p3" textAlign="right">
                {conversion}
              </TextBlock>
            </Flex>
          </Box>
          <Box alignSelf="center">{button}</Box>
        </Box>
      </Box>
    </Flex>
  );
};

const ActionButton = ({ children, ...props }) => (
  <Button width="100px" p="xs" variant="secondary" {...props}>
    <TextBlock t="p5" color="black4">
      {children}
    </TextBlock>
  </Button>
);

const CdpViewCard = ({ title, rows, isAction }) => {
  const [titleRow, middleRow, bottomRow] = rows;
  return (
    <Box my="s">
      <CardTitle title={title} />
      <Card px="m" py="s" my="s">
        <TopContainerRow props={titleRow} />
        {isAction ? (
          <ActionContainerRow props={middleRow} />
        ) : (
          <InfoContainerRow props={middleRow} />
        )}
        <Box borderBottom="1px solid" borderColor="grayLight4" />
        {isAction ? (
          <ActionContainerRow props={bottomRow} />
        ) : (
          <InfoContainerRow props={bottomRow} />
        )}
      </Card>
    </Box>
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

  if (!cdp) return <LoadingLayout />;

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
        <CdpViewCard
          title={lang.cdp_page.liquidation_price}
          rows={[
            [liquidationPrice.toFixed(2), `(${cdp.ilk}/USD)`],
            [
              `${lang.cdp_page.current_price_info} (ETH/USD)`,
              collateralPrice.toFixed(2)
            ],
            [
              lang.cdp_page.liquidation_penalty,
              cdp.ilkData.liquidationPenalty + '%'
            ]
          ]}
          isAction={false}
        />

        <CdpViewCard
          title={lang.cdp_page.collateralization_ratio}
          rows={[
            [
              collateralizationRatio &&
                parseFloat(collateralizationRatio).toFixed(2) + '%',
              '\u00A0'
            ],
            [
              lang.cdp_page.minimum_ratio,
              cdp.ilkData.liquidationRatio + '.00%'
            ],
            [lang.cdp_page.stability_fee, stabilityFee]
          ]}
          isAction={false}
        />

        <CdpViewCard
          title={`${cdpId} ${lang.cdp_page.collateral}`}
          rows={[
            [
              cdp.collateral.toString(),
              (collateralPrice * collateralInt).toFixed(2) + ' USD'
            ],
            [
              lang.cdp_page.locked,
              lockedCollateral && lockedCollateral.toFixed(2) + ` ${cdp.ilk}`,
              `${(lockedCollateral * collateralPrice).toFixed(2)} USD`,
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
            ],
            [
              lang.cdp_page.able_withdraw,
              freeCollateral &&
                freeCollateral.toFixed(2) + ` ${collateralDenomination}`,
              (freeCollateral * collateralPrice).toFixed(2) + ' USD',
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
            ]
          ]}
          isAction={true}
        />

        <CdpViewCard
          title={`DAI ${lang.cdp_page.position}`}
          rows={[
            [cdp.debt.toString(), lang.cdp_page.outstanding_debt],
            [
              `DAI ${lang.cdp_page.wallet_balance}`,
              `${debtInt && debtInt.toFixed(2)} DAI`,
              `${debtInt && debtInt.toFixed(2)} USD`,
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
            ],
            [
              lang.cdp_page.able_generate,
              `${generateAmount && generateAmount.toFixed(2)} DAI`,
              `${generateAmount && generateAmount.toFixed(2)} USD`,
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
            ]
          ]}
          isAction={true}
        />
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
