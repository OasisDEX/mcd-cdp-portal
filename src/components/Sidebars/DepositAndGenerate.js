import React from 'react';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import { formatCollateralizationRatio, formatter } from 'utils/ui';
import useValidatedInput from 'hooks/useValidatedInput';
import useMaker from 'hooks/useMaker';
import useLanguage from 'hooks/useLanguage';
import { greaterThan } from 'utils/bignumber';
import useWalletBalances from 'hooks/useWalletBalances';
import useTokenAllowance from 'hooks/useTokenAllowance';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import { DAI } from '@makerdao/dai-plugin-mcd';
import {
  daiAvailable as calcDaiAvailable,
  liquidationPrice as calcLiquidationPrice
} from '@makerdao/dai-plugin-mcd/src/math';
import { getCurrency } from 'utils/cdp';
import BigNumber from 'bignumber.js';
import { decimalRules } from '../../styles/constants';
import RatioDisplay, { RatioDisplayTypes } from 'components/RatioDisplay';

const { long, medium } = decimalRules;
const DepositAndGenerate = ({ vault, reset }) => {
  const { lang } = useLanguage();
  const { maker } = useMaker();
  let {
    vaultType,
    debtValue,
    liquidationRatio,
    debtFloor,
    collateralAmount,
    collateralTypePrice,
    collateralDebtAvailable,
    collateralizationRatio
  } = vault;
  debtValue = debtValue.toBigNumber().decimalPlaces(18);
  collateralDebtAvailable = collateralDebtAvailable?.toBigNumber();

  const symbol = collateralAmount?.symbol;
  const gemBalances = useWalletBalances();
  const gemBalance = gemBalances[symbol] || 0;
  const { hasSufficientAllowance } = useTokenAllowance(symbol);

  const dustLimitValidation = value =>
    debtFloor.gt(debtValue.plus(BigNumber(value)));

  const debtCeilingValidation = value =>
    greaterThan(value, collateralDebtAvailable);

  const [
    depositAmount,
    ,
    onDepositAmountChange,
    depositFailureMessage
  ] = useValidatedInput(
    '',
    {
      maxFloat: gemBalance,
      minFloat: 0,
      isFloat: true,
      custom: {
        allowanceInvalid: value => !hasSufficientAllowance(value)
      }
    },
    {
      maxFloat: () =>
        lang.formatString(lang.action_sidebar.insufficient_balance, symbol),
      allowanceInvalid: () =>
        lang.formatString(lang.action_sidebar.invalid_allowance, symbol)
    }
  );

  const calculatedCollateralAmount = collateralAmount.plus(
    !depositAmount ? BigNumber(0) : BigNumber(depositAmount)
  );
  const calculatedCollateralValue = calculatedCollateralAmount.times(
    collateralTypePrice
  );
  const calculatedDaiAvailable = calcDaiAvailable(
    calculatedCollateralValue.toBigNumber(),
    debtValue,
    liquidationRatio.toBigNumber()
  );

  const [
    generateAmount,
    ,
    onGenerateAmountChange,
    generateFailureMessage
  ] = useValidatedInput(
    '',
    {
      maxFloat: formatter(calculatedDaiAvailable),
      minFloat: 0,
      isFloat: true,
      custom: {
        dustLimit: dustLimitValidation,
        debtCeiling: debtCeilingValidation
      }
    },
    {
      maxFloat: () => lang.action_sidebar.cdp_below_threshold,
      dustLimit: () =>
        lang.formatString(
          lang.cdp_create.below_dust_limit,
          formatter(debtFloor)
        ),
      debtCeiling: () =>
        lang.formatString(
          lang.action_sidebar.generate_threshold,
          formatter(collateralDebtAvailable)
        )
    }
  );

  const calculatedDebtValue = debtValue.plus(
    !generateAmount ? BigNumber(0) : BigNumber(generateAmount)
  );

  const calculatedLiquidationPrice = calcLiquidationPrice(
    calculatedCollateralAmount.toBigNumber(),
    calculatedDebtValue,
    liquidationRatio.toBigNumber()
  );

  const calculatedCollateralizationRatio = vault.calculateCollateralizationRatio(
    {
      collateralValue: calculatedCollateralValue,
      debtValue: calculatedDebtValue
    }
  );

  const depositAndGenerate = () => {
    const currency = getCurrency({ ilk: vaultType });

    maker
      .service('mcd:cdpManager')
      .lockAndDraw(
        vault.id,
        vaultType,
        currency(depositAmount),
        DAI(generateAmount)
      );
    reset();
  };

  const actionDisabled =
    !depositAmount ||
    !generateAmount ||
    depositFailureMessage ||
    generateFailureMessage;

  return (
    <Grid gridRowGap="m">
      <Grid gridRowGap="s">
        <Text.h4 color="darkLavender">
          {lang.action_sidebar.deposit_and_generate_title}
        </Text.h4>
        <Text t="body">
          {lang.formatString(lang.action_sidebar.deposit_description, symbol)}
        </Text>
        <Input
          type="number"
          min="0"
          value={depositAmount}
          onChange={onDepositAmountChange}
          placeholder={`0.00 ${symbol}`}
          failureMessage={depositFailureMessage}
          data-testid="deposit-input"
        />

        <Text.p t="body">{lang.action_sidebar.generate_description}</Text.p>
        <Input
          type="number"
          value={generateAmount}
          min="0"
          onChange={onGenerateAmountChange}
          placeholder="0.00 DAI"
          failureMessage={generateFailureMessage}
        />
      </Grid>
      <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
        <Button disabled={actionDisabled} onClick={depositAndGenerate}>
          {lang.actions.generate}
        </Button>
        <Button variant="secondary-outline" onClick={reset}>
          {lang.cancel}
        </Button>
      </Grid>
      <InfoContainer>
        <Info
          title={lang.action_sidebar.maximum_available_to_generate}
          body={`${formatter(calculatedDaiAvailable, { precision: long })} DAI`}
        />
        <Info
          title={lang.action_sidebar.new_liquidation_price}
          body={`${formatter(calculatedLiquidationPrice, {
            infinity: BigNumber(0).toFixed(medium)
          })} USD/${symbol}`}
        />
        <Info
          title={lang.action_sidebar.new_collateralization_ratio}
          body={
            <RatioDisplay
              type={RatioDisplayTypes.TEXT}
              ratio={formatter(calculatedCollateralizationRatio, {
                infinity: collateralizationRatio
              })}
              ilkLiqRatio={formatter(liquidationRatio, { percentage: true })}
              text={formatCollateralizationRatio(
                calculatedCollateralizationRatio
              )}
            />
          }
        />
      </InfoContainer>
    </Grid>
  );
};

export default DepositAndGenerate;
