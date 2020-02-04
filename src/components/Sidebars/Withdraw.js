import React from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useMaker from '../../hooks/useMaker';
import { greaterThan } from '../../utils/bignumber';
import useValidatedInput from 'hooks/useValidatedInput';
import useLanguage from 'hooks/useLanguage';
import { formatCollateralizationRatio } from '../../utils/ui';
import SetMax from 'components/SetMax';
import RatioDisplay, { RatioDisplayTypes } from 'components/RatioDisplay';
import BigNumber from 'bignumber.js';
import useAnalytics from 'hooks/useAnalytics';
import { getCurrency } from 'utils/cdp';
import { formatter } from 'utils/ui';
import { multiply } from 'utils/bignumber';

const Withdraw = ({ vault, reset }) => {
  const { trackBtnClick } = useAnalytics('Withdraw', 'Sidebar');
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();

  let {
    vaultType,
    liquidationRatioSimple: liquidationRatio,
    collateralAvailableAmount,
    collateralTypePrice,
    collateralAmount: cdpManagerCollateralAmount,
    collateralValue,
    encumberedCollateral,
    encumberedDebt: debtAmount
  } = vault;
  BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
  collateralAvailableAmount = collateralAvailableAmount.toBigNumber();

  const symbol = cdpManagerCollateralAmount?.symbol;

  const [amount, setAmount, onAmountChange, amountErrors] = useValidatedInput(
    '',
    {
      maxFloat: collateralAvailableAmount,
      minFloat: 0,
      isFloat: true
    },
    {
      maxFloat: () => lang.action_sidebar.cdp_below_threshold
    }
  );

  const setMax = () => setAmount(collateralAvailableAmount);
  const undercollateralized =
    amount && greaterThan(amount, collateralAvailableAmount);

  const withdraw = () => {
    const currency = getCurrency({ ilk: vaultType });
    newTxListener(
      maker
        .service('mcd:cdpManager')
        .wipeAndFree(vault.id, vaultType, MDAI(0), currency(amount)),
      lang.formatString(lang.transactions.withdrawing_gem, symbol)
    );
    reset();
  };

  const valueDiff = amount
    ? multiply(amount, collateralTypePrice.toNumber())
    : 0;

  const liquidationPrice = vault.calculateLiquidationPrice({
    collateralAmount: encumberedCollateral.minus(amount || 0)
  });

  const collateralizationRatio = vault.calculateCollateralizationRatio({
    collateralValue: collateralValue.minus(valueDiff)
  });

  return (
    <Grid gridRowGap="m">
      <Grid gridRowGap="s">
        <Text.h4 color="darkLavender">
          {lang.formatString(lang.action_sidebar.withdraw_title, symbol)}
        </Text.h4>
        <Text.p t="body">
          {lang.formatString(lang.action_sidebar.withdraw_description, symbol)}
        </Text.p>
        <Input
          type="number"
          placeholder={`0.00 ${symbol}`}
          value={amount}
          min="0"
          onChange={onAmountChange}
          after={
            parseFloat(debtAmount) === 0 ? (
              <SetMax
                onClick={() => {
                  setMax();
                  trackBtnClick('SetMax', {
                    collateralAvailableAmount,
                    setMax: true
                  });
                }}
              />
            ) : null
          }
          failureMessage={amountErrors}
        />
        <RatioDisplay
          type={RatioDisplayTypes.CARD}
          ratio={collateralizationRatio}
          ilkLiqRatio={formatter(liquidationRatio, { percentage: true })}
          text={lang.action_sidebar.withdraw_warning}
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
            withdraw();
          }}
        >
          {lang.actions.withdraw}
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
          title={lang.action_sidebar.maximum_available_to_withdraw}
          body={`${formatter(collateralAvailableAmount, {
            precision: 6
          })} ${symbol}`}
        />
        <Info
          title={lang.formatString(
            lang.action_sidebar.gem_usd_price_feed,
            symbol
          )}
          body={`${formatter(collateralTypePrice)} USD/${symbol}`}
        />
        <Info
          title={lang.action_sidebar.new_liquidation_price}
          body={`${formatter(liquidationPrice)} USD/${symbol}`}
        />
        <Info
          title={lang.action_sidebar.new_collateralization_ratio}
          body={
            <RatioDisplay
              type={RatioDisplayTypes.TEXT}
              ratio={collateralizationRatio}
              ilkLiqRatio={formatter(liquidationRatio, { percentage: true })}
              text={formatCollateralizationRatio(collateralizationRatio)}
              show={amount !== '' && amount > 0 && !undercollateralized}
            />
          }
        />
      </InfoContainer>
    </Grid>
  );
};
export default Withdraw;
