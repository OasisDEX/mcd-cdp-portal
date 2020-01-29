import React from 'react';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useMaker from 'hooks/useMaker';
import useProxy from 'hooks/useProxy';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useWalletBalances from 'hooks/useWalletBalances';
import useValidatedInput from 'hooks/useValidatedInput';
import useLanguage from 'hooks/useLanguage';
import useAnalytics from 'hooks/useAnalytics';
import { formatCollateralizationRatio } from 'utils/ui';
import { multiply } from 'utils/bignumber';
import { getCurrency } from 'utils/cdp';
import ProxyAllowanceToggle from 'components/ProxyAllowanceToggle';
import BigNumber from 'bignumber.js';

const Deposit = ({ cdpId, vault, reset }) => {
  const { trackBtnClick } = useAnalytics('Deposit', 'Sidebar');
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();
  const { hasProxy } = useProxy();

  let {
    vaultType,
    collateralTypePrice,
    collateralValue,
    collateralAmount
  } = vault;

  const symbol = collateralAmount?.symbol;
  const { hasAllowance, hasSufficientAllowance } = useTokenAllowance(symbol);
  const gemBalances = useWalletBalances();
  const gemBalance = gemBalances[symbol] || 0;

  const [amount, , onAmountChange, amountErrors] = useValidatedInput(
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
  const valid = amount && !amountErrors && hasAllowance && hasProxy;
  const amountToDeposit = amount || BigNumber(0);

  const deposit = () => {
    const currency = getCurrency({ ilk: vaultType });
    newTxListener(
      maker
        .service('mcd:cdpManager')
        .lock(cdpId, vaultType, currency(amountToDeposit)),
      lang.formatString(lang.transactions.depositing_gem, symbol)
    );
    reset();
  };

  const valueDiff = multiply(amountToDeposit, collateralTypePrice.toNumber());
  return (
    <Grid gridRowGap="m">
      <Grid gridRowGap="s">
        <Text color="darkLavender" t="h4">
          {lang.formatString(lang.action_sidebar.deposit_title, symbol)}
        </Text>
        <p>
          <Text t="body">
            {lang.formatString(lang.action_sidebar.deposit_description, symbol)}
          </Text>
        </p>
        <Input
          type="number"
          min="0"
          value={amount}
          onChange={onAmountChange}
          placeholder={`0.00 ${symbol}`}
          failureMessage={amountErrors}
          data-testid="deposit-input"
        />
      </Grid>
      <ProxyAllowanceToggle token={symbol} trackBtnClick={trackBtnClick} />
      <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
        <Button
          disabled={!valid}
          onClick={() => {
            trackBtnClick('Confirm', { amount });
            deposit();
          }}
        >
          {lang.actions.deposit}
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
          title={lang.action_sidebar.current_account_balance}
          body={`${gemBalance} ${symbol}`}
        />
        <Info
          title={lang.formatString(
            lang.action_sidebar.gem_usd_price_feed,
            symbol
          )}
          body={`${collateralTypePrice} ${symbol}/USD`}
        />
        <Info
          title={lang.action_sidebar.new_liquidation_price}
          body={vault
            .calculateLiquidationPrice({
              collateralAmount: collateralAmount.plus(amountToDeposit)
            })
            ?.toString()}
        />
        <Info
          title={lang.action_sidebar.new_collateralization_ratio}
          body={formatCollateralizationRatio(
            vault.calculateCollateralizationRatio({
              collateralValue: collateralValue.plus(valueDiff)
            })
          )}
        />
      </InfoContainer>
    </Grid>
  );
};
export default Deposit;
