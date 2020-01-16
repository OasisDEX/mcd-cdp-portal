import React, { useState, useEffect } from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useStore from 'hooks/useStore';
import useValidatedInput from 'hooks/useValidatedInput';
import useLanguage from 'hooks/useLanguage';
import useAnalytics from 'hooks/useAnalytics';
import { getCdp, getDebtAmount, getCollateralAmount } from 'reducers/cdps';
import { calcCDPParams } from '../../utils/cdp';
import { add, subtract, greaterThan } from '../../utils/bignumber';
import {
  formatCollateralizationRatio,
  formatLiquidationPrice,
  safeToFixed
} from '../../utils/ui';
import useMaker from '../../hooks/useMaker';
import RatioDisplay, { RatioDisplayTypes } from 'components/RatioDisplay';

const Generate = ({ cdpId, reset }) => {
  const { trackBtnClick } = useAnalytics('Generate', 'Sidebar');
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();
  const [daiAvailable, setDaiAvailable] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [collateralizationRatio, setCollateralizationRatio] = useState(0);

  const [storeState] = useStore();
  const cdp = getCdp(cdpId, storeState);
  const { liquidationRatio } = cdp;

  const collateralAmount = getCollateralAmount(cdp, false);
  const debtAmount = getDebtAmount(cdp, false);
  const undercollateralized = greaterThan(
    liquidationRatio,
    collateralizationRatio
  );

  const dustLimit = cdp.dust ? cdp.dust : 0;

  // minFloat uses <= so it won't work for dustLimit
  const dustLimitValidation = value =>
    greaterThan(dustLimit, add(value, debtAmount));

  const [amount, , onAmountChange, amountErrors] = useValidatedInput(
    '',
    {
      maxFloat: daiAvailable,
      isFloat: true,
      custom: {
        dustLimit: dustLimitValidation
      }
    },
    {
      maxFloat: () => lang.action_sidebar.cdp_below_threshold,
      dustLimit: () =>
        lang.formatString(lang.cdp_create.below_dust_limit, dustLimit)
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
      daiToDraw: add(debtAmount, amountToGenerate)
    });

    // fractional diffs between daiAvailable & debtAmount can result in a negative amount
    const daiAvailablePositive = Math.max(
      0,
      subtract(daiAvailable, debtAmount)
    );

    setDaiAvailable(daiAvailablePositive);
    setLiquidationPrice(liquidationPrice);
    setCollateralizationRatio(collateralizationRatio);
  }, [amount, cdp, collateralAmount, debtAmount]);

  const generate = () => {
    newTxListener(
      maker.service('mcd:cdpManager').draw(cdpId, cdp.ilk, MDAI(amount)),
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
        <RatioDisplay
          type={RatioDisplayTypes.CARD}
          ratio={collateralizationRatio}
          ilkLiqRatio={liquidationRatio}
          text={lang.action_sidebar.generate_warning}
          onlyWarnings={true}
          show={amount !== '' && amount > 0 && !undercollateralized}
          textAlign="center"
        />
      </Grid>
      <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
        <Button
          disabled={!amount || amountErrors}
          onClick={() => {
            trackBtnClick('Confirm', { amount });
            generate();
          }}
        >
          {lang.actions.generate}
        </Button>
        <Button
          variant="secondary-outline"
          onClick={() => {
            trackBtnClick('Cancel');
            reset();
          }}
        >
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
            <RatioDisplay
              type={RatioDisplayTypes.TEXT}
              ratio={collateralizationRatio}
              ilkLiqRatio={liquidationRatio}
              text={formatCollateralizationRatio(collateralizationRatio)}
              show={amount !== '' && amount > 0 && !undercollateralized}
            />
          }
        />
      </InfoContainer>
    </Grid>
  );
};
export default Generate;
