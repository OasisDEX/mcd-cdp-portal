import React from 'react';
import BigNumber from 'bignumber.js';
import { DAI } from '@makerdao/dai-plugin-mcd';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import SetMax from 'components/SetMax';
import RatioDisplay, { RatioDisplayTypes } from 'components/RatioDisplay';
import useMaker from 'hooks/useMaker';
import useLanguage from 'hooks/useLanguage';
import useAnalytics from 'hooks/useAnalytics';
import useValidatedInput from 'hooks/useValidatedInput';
import { greaterThan, multiply } from 'utils/bignumber';
import { formatCollateralizationRatio, formatter } from 'utils/ui';
import { getCurrency } from 'utils/cdp';
import { decimalRules } from '../../styles/constants';
const { long } = decimalRules;

const Withdraw = ({ vault, reset }) => {
  const { trackBtnClick } = useAnalytics('Withdraw', 'Sidebar');
  const { lang } = useLanguage();
  const { maker } = useMaker();

  let {
    vaultType,
    liquidationRatio,
    collateralAvailableAmount,
    collateralTypePrice,
    collateralAmount,
    collateralValue,
    encumberedCollateral,
    encumberedDebt: debtAmount
  } = vault;
  BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
  collateralAvailableAmount = collateralAvailableAmount.toBigNumber();
  collateralValue = collateralValue.toBigNumber();

  const symbol = collateralAmount?.symbol;

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

  const amountToWithdraw = amount || BigNumber(0);
  const undercollateralized =
    amount && greaterThan(amount, collateralAvailableAmount);

  const setMax = () => setAmount(collateralAvailableAmount);

  const currency = getCurrency({ ilk: vaultType });
  const withdraw = () => {
    maker
      .service('mcd:cdpManager')
      .wipeAndFree(vault.id, vaultType, DAI(0), currency(amountToWithdraw));
    reset();
  };

  const valueDiff = multiply(amountToWithdraw, collateralTypePrice.toNumber());

  const liquidationPrice =
    undercollateralized || debtAmount.eq(0)
      ? BigNumber(0)
      : vault.calculateLiquidationPrice({
          collateralAmount: currency(
            encumberedCollateral.minus(amountToWithdraw)
          )
        });

  const collateralizationRatio = vault.calculateCollateralizationRatio({
    collateralValue: collateralValue.minus(valueDiff).gte(0)
      ? currency(collateralValue.minus(valueDiff))
      : currency(0)
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
                    collateralAvailableAmount: collateralAvailableAmount.toString(),
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
          ratio={formatter(collateralizationRatio)}
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
            trackBtnClick('Confirm', {
              amount,
              fathom: { id: `${symbol}VaultWithdraw`, amount }
            });
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
            precision: long
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
              ratio={formatter(collateralizationRatio)}
              ilkLiqRatio={formatter(liquidationRatio, { percentage: true })}
              text={formatCollateralizationRatio(collateralizationRatio)}
            />
          }
        />
      </InfoContainer>
    </Grid>
  );
};
export default Withdraw;
