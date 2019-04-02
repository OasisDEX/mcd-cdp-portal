import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import PageContentLayout from 'layouts/PageContentLayout';
import LoadingLayout from 'layouts/LoadingLayout';
import lang from 'languages';
import { Box, Grid, Flex, Card, Button } from '@makerdao/ui-components-core';
import { Title, TextBlock } from 'components/Typography';
import useMaker from 'hooks/useMaker';
import { getIlkData } from 'reducers/network/cdpTypes';

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

const ActionButton = ({ name, onClick }) => (
  <Button width="100px" p="xs" variant="secondary" onClick={onClick}>
    <TextBlock t="p5" color="black4">
      {name}
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

function CDPView({ cdpId, getIlk }) {
  const { maker } = useMaker();

  // TODO cdpTypeSlug should become `id` or we should have both cdpTypeSlug AND id.
  const [cdpState, setCDP] = useState(null);

  useEffect(() => {
    (async () => {
      const cdpManager = maker.service('mcd:cdpManager');
      const cdp = await cdpManager.getCdp(parseInt(cdpId));
      const ilkData = getIlk(cdp.ilk);
      const [
        debt,
        collateral,
        collateralPrice,
        collateralizationRatio,
        liquidationPrice,
        daiAvailable,
        lockedCollateral,
        freeCollateral
      ] = await Promise.all([
        cdp.getDebtValue(),
        cdp.getCollateralAmount(),
        cdp._cdpType.getPrice(),
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
        lockedCollateral,
        freeCollateral
      });
    })();
  }, [cdpId, getIlk, maker]);

  if (!cdpState) return <LoadingLayout />;

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
            [
              cdpState.liquidationPrice.toString(),
              `(${cdpState.ilkData.gem}/USD)`
            ],
            [
              `${lang.cdp_page.current_price_info} (${
                cdpState.ilkData.gem
              }/USD)`,
              cdpState.collateralPrice.toFixed(2) / 100
            ],
            [
              lang.cdp_page.liquidation_penalty,
              cdpState.ilkData.liquidationPenalty + '%'
            ]
          ]}
          isAction={false}
        />

        <CdpViewCard
          title={lang.cdp_page.collateralization_ratio}
          rows={[
            [
              (parseFloat(cdpState.collateralizationRatio) * 100).toFixed(2) +
                '%',
              '\u00A0'
            ],
            [
              lang.cdp_page.minimum_ratio,
              cdpState.ilkData.liquidationRatio + '.00%'
            ],
            [
              lang.cdp_page.stability_fee,
              parseFloat(cdpState.ilkData.rate) * 100 + '%'
            ]
          ]}
          isAction={false}
        />

        <CdpViewCard
          title={`${cdpId} ${lang.cdp_page.collateral}`}
          rows={[
            [
              cdpState.collateral.toString(),
              cdpState.collateral.times(cdpState.collateralPrice).toFixed(2) /
                100 +
                ' USD'
            ],
            [
              lang.cdp_page.locked,
              cdpState.lockedCollateral.toNumber().toFixed(4) +
                ` ${cdpState.ilkData.gem}`,
              `${(
                cdpState.lockedCollateral.toNumber() *
                cdpState.collateralPrice.toNumber()
              ).toFixed(2)} USD`,
              <ActionButton name={lang.actions.deposit} />
            ],
            [
              lang.cdp_page.able_withdraw,
              cdpState.freeCollateral.toNumber().toFixed(2) +
                ` ${cdpState.ilkData.gem}`,
              (
                cdpState.freeCollateral.toNumber() *
                cdpState.collateralPrice.toNumber()
              ).toFixed(2) + ' USD',
              <ActionButton name={lang.actions.withdraw} />
            ]
          ]}
          isAction={true}
        />

        <CdpViewCard
          title={`DAI ${lang.cdp_page.position}`}
          rows={[
            [cdpState.debt.toString(), lang.cdp_page.outstanding_debt],
            [
              `DAI ${lang.cdp_page.wallet_balance}`,
              `${cdpState.debt.toNumber().toFixed(2)} DAI`,
              `${cdpState.debt.toNumber().toFixed(2)} USD`,
              <ActionButton name={lang.actions.pay_back} />
            ],
            [
              lang.cdp_page.able_generate,
              `${parseFloat(cdpState.daiAvailable).toFixed(2)} DAI`,
              `${parseFloat(cdpState.daiAvailable).toFixed(2)} USD`,
              <ActionButton name={lang.actions.generate} />
            ]
          ]}
          isAction={true}
        />
      </Grid>
    </PageContentLayout>
  );
}

function mapStateToProps(state) {
  return {
    getIlk: key => getIlkData(state, key)
  };
}

export default hot(connect(mapStateToProps)(CDPView));
