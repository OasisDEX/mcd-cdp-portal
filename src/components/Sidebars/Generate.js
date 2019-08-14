import React, { useState, useEffect } from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useStore from 'hooks/useStore';
import { greaterThan } from '../../utils/bignumber';
import { getCdp, getDebtAmount, getCollateralAmount } from 'reducers/cdps';
import { calcCDPParams } from '../../utils/cdp';
import {
  formatCollateralizationRatio,
  formatLiquidationPrice
} from '../../utils/ui';
import lang from 'languages';
import useMaker from '../../hooks/useMaker';

const Generate = ({ cdpId, reset }) => {
  const { maker, newTxListener } = useMaker();
  const [amount, setAmount] = useState('');
  const [daiAvailable, setDaiAvailable] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [collateralizationRatio, setCollateralizationRatio] = useState(0);

  const [storeState] = useStore();
  const cdp = getCdp(cdpId, storeState);

  const collateralAmount = getCollateralAmount(cdp, true, 9);
  const debtAmount = getDebtAmount(cdp);

  useEffect(() => {
    const amountToGenerate = parseFloat(amount || 0);
    const {
      liquidationPrice,
      collateralizationRatio,
      daiAvailable
    } = calcCDPParams({
      ilkData: cdp,
      gemsToLock: collateralAmount,
      daiToDraw: debtAmount + amountToGenerate
    });

    setDaiAvailable(daiAvailable - debtAmount);
    setLiquidationPrice(liquidationPrice);
    setCollateralizationRatio(collateralizationRatio);
  }, [amount, cdp, collateralAmount, debtAmount]);

  const undercollateralized = greaterThan(
    cdp.liquidationRatio,
    collateralizationRatio
  );
  const valid = parseFloat(amount) >= 0 && !undercollateralized;

  const generate = () => {
    newTxListener(
      maker
        .service('mcd:cdpManager')
        .lockAndDraw(cdpId, cdp.ilk, cdp.currency(0), MDAI(parseFloat(amount))),
      lang.transactions.generate_dai
    );
    reset();
  };

  return (
    <Grid gridRowGap="m">
      <Grid gridRowGap="s">
        <Text.h4 color="darkLavender">
          {lang.action_sidebar.generate_title}
        </Text.h4>
        <Text.p t="body">{lang.action_sidebar.generate_description}</Text.p>
        <Input
          type="number"
          value={amount}
          min="0"
          onChange={evt => setAmount(evt.target.value)}
          placeholder="0.00 DAI"
          errorMessage={
            undercollateralized ? lang.action_sidebar.cdp_below_threshold : null
          }
        />
      </Grid>
      <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
        <Button onClick={generate} disabled={!valid}>
          {lang.actions.generate}
        </Button>
        <Button variant="secondary-outline" onClick={reset}>
          {lang.cancel}
        </Button>
      </Grid>
      <InfoContainer>
        <Info
          title={lang.action_sidebar.maximum_available_to_generate}
          body={`${daiAvailable.toFixed(6)} DAI`}
        />
        <Info
          title={lang.action_sidebar.new_liquidation_price}
          body={formatLiquidationPrice(liquidationPrice, cdp.currency.symbol)}
        />
        <Info
          title={lang.action_sidebar.new_collateralization_ratio}
          body={
            <Text color={undercollateralized ? 'orange.600' : null}>
              {formatCollateralizationRatio(collateralizationRatio)}
            </Text>
          }
        />
      </InfoContainer>
    </Grid>
  );
};
export default Generate;
