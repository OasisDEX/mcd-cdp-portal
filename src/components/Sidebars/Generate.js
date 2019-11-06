import React, { useState, useEffect } from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useStore from 'hooks/useStore';
import useValidatedInput from 'hooks/useValidatedInput';
import useLanguage from 'hooks/useLanguage';
import { greaterThan } from '../../utils/bignumber';
import { getCdp, getDebtAmount, getCollateralAmount } from 'reducers/cdps';
import { calcCDPParams } from '../../utils/cdp';
import {
  formatCollateralizationRatio,
  formatLiquidationPrice,
  safeToFixed
} from '../../utils/ui';
import useMaker from '../../hooks/useMaker';

const Generate = ({ cdpId, reset }) => {
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();
  const [daiAvailable, setDaiAvailable] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [collateralizationRatio, setCollateralizationRatio] = useState(0);

  const [storeState] = useStore();
  const cdp = getCdp(cdpId, storeState);

  const collateralAmount = getCollateralAmount(cdp, false);
  const debtAmount = getDebtAmount(cdp, false);
  const undercollateralized = greaterThan(
    cdp.liquidationRatio,
    collateralizationRatio
  );

  const [amount, , onAmountChange, amountErrors] = useValidatedInput(
    '',
    {
      minFloat: 0,
      maxFloat: daiAvailable,
      isFloat: true
    },
    {
      maxFloat: () => lang.action_sidebar.cdp_below_threshold
    }
  );

  useEffect(() => {
    const amountToGenerate = amount || 0;
    const {
      liquidationPrice,
      collateralizationRatio,
      daiAvailable
    } = calcCDPParams({
      ilkData: cdp,
      gemsToLock: collateralAmount,
      daiToDraw: debtAmount + amountToGenerate
    });

    // fractional diffs between daiAvailable & debtAmount can result in a negative amount
    const daiAvailablePositive = Math.max(0, daiAvailable - debtAmount);

    setDaiAvailable(daiAvailablePositive);
    setLiquidationPrice(liquidationPrice);
    setCollateralizationRatio(collateralizationRatio);
  }, [amount, cdp, collateralAmount, debtAmount]);

  const generate = () => {
    newTxListener(
      maker
        .service('mcd:cdpManager')
        .lockAndDraw(cdpId, cdp.ilk, cdp.currency(0), MDAI(amount)),
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
          onChange={onAmountChange}
          placeholder="0.00 DAI"
          failureMessage={amountErrors}
        />
      </Grid>
      <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
        <Button onClick={generate} disabled={!amount || amountErrors}>
          {lang.actions.generate}
        </Button>
        <Button variant="secondary-outline" onClick={reset}>
          {lang.cancel}
        </Button>
      </Grid>
      <InfoContainer>
        <Info
          title={lang.action_sidebar.maximum_available_to_generate}
          body={`${safeToFixed(daiAvailable, 7)} DAI`}
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
