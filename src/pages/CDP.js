import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import PageContentLayout from 'layouts/PageContentLayout';
import lang from 'languages';
import { calcCDPParams } from 'utils/ui';
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
  const [cdpState, setCDPState] = useState(null);
  const [collateralVal, setCollateralVal] = useState('');
  const [debtVal, setDebtVal] = useState('');
  const [ilk, setIlk] = useState(null);

  useEffect(() => {
    (async () => {
      const cdpManager = maker.service('mcd:cdpManager');
      const cdp = await cdpManager.getCdp(parseInt(cdpId));
      setCDPState(cdp);
      setIlk(getIlk(cdp.ilk));
      setCollateralVal(await cdp.getCollateralValue());
      setDebtVal(await cdp.getDebtValue());
    })();
  }, [cdpId, maker]);

  console.log('CDP state to be rendered on the page:', cdpState);
  let { liquidationPrice, collateralPrice, liquidationPenalty } = ['', 1, ''];
  let { collateralizationRatio, liquidationRatio, stabilityFee } = ['', '', ''];
  let {
    collateralInt,
    collateralDenomination,
    lockedCollateral,
    freeCollateral
  } = [1, '', 1, 1];
  let { debtInt, daiAvailable } = [0, 0];
  let generateAmount = 0;
  if (cdpState && collateralVal && debtVal && ilk) {
    collateralInt = collateralVal.toNumber();
    collateralDenomination = collateralVal.toString().split(' ')[1];
    debtInt = debtVal.toNumber();
    collateralPrice = ilk.feedValueUSD.toNumber();
    liquidationPenalty = ilk.liquidationPenalty;
    liquidationRatio = ilk.liquidationRatio;
    let cdpParams = calcCDPParams({
      ilkData: ilk,
      gemsToLock: collateralInt,
      daiToDraw: debtInt
    });
    liquidationPrice = cdpParams.liquidationPrice;
    collateralizationRatio = parseFloat(cdpParams.collateralizationRatio);
    daiAvailable = parseFloat(cdpParams.daiAvailable);
    stabilityFee = parseFloat(ilk.rate) * 100 + '%';
    lockedCollateral =
      (debtInt * (parseInt(liquidationRatio) / 100)) / collateralPrice;
    freeCollateral = collateralInt - lockedCollateral;
    generateAmount = daiAvailable - debtInt;
  }
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
            [liquidationPrice, `(${collateralDenomination}/USD)`],
            [
              `${lang.cdp_page.current_price_info} (ETH/USD)`,
              collateralPrice && collateralPrice.toFixed(2)
            ],
            [lang.cdp_page.liquidation_penalty, liquidationPenalty + '%']
          ]}
          isAction={false}
        />

        <CdpViewCard
          title={lang.cdp_page.collateralization_ratio}
          rows={[
            [
              collateralizationRatio && collateralizationRatio.toFixed(2) + '%',
              '\u00A0'
            ],
            [lang.cdp_page.minimum_ratio, liquidationRatio + '.00%'],
            [lang.cdp_page.stability_fee, stabilityFee]
          ]}
          isAction={false}
        />

        <CdpViewCard
          title={`${cdpId} ${lang.cdp_page.collateral}`}
          rows={[
            [
              collateralVal && collateralVal.toString(),
              (collateralPrice * collateralInt).toFixed(2) + ' USD'
            ],
            [
              lang.cdp_page.locked,
              lockedCollateral &&
                lockedCollateral.toFixed(2) + ` ${collateralDenomination}`,
              `${(lockedCollateral * collateralPrice).toFixed(2)} USD`,
              <ActionButton name={lang.actions.deposit} />
            ],
            [
              lang.cdp_page.able_withdraw,
              freeCollateral &&
                freeCollateral.toFixed(2) + ` ${collateralDenomination}`,
              (freeCollateral * collateralPrice).toFixed(2) + ' USD',
              <ActionButton name={lang.actions.withdraw} />
            ]
          ]}
          isAction={true}
        />

        <CdpViewCard
          title={`DAI ${lang.cdp_page.position}`}
          rows={[
            [debtVal && debtVal.toString(), lang.cdp_page.outstanding_debt],
            [
              `DAI ${lang.cdp_page.wallet_balance}`,
              `${debtInt && debtInt.toFixed(2)} DAI`,
              `${debtInt && debtInt.toFixed(2)} USD`,
              <ActionButton name={lang.actions.pay_back} />
            ],
            [
              lang.cdp_page.able_generate,
              `${generateAmount && generateAmount.toFixed(2)} DAI`,
              `${generateAmount && generateAmount.toFixed(2)} USD`,
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
