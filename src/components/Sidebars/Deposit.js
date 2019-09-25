import React, { useState, useEffect } from 'react';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useMaker from 'hooks/useMaker';
import useStore from 'hooks/useStore';
import useProxy from 'hooks/useProxy';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useWalletBalances from 'hooks/useWalletBalances';
import useValidatedInput from 'hooks/useValidatedInput';
import useLanguage from 'hooks/useLanguage';
import {
  getCdp,
  getDebtAmount,
  getCollateralPrice,
  getCollateralAmount
} from 'reducers/cdps';
import { calcCDPParams } from 'utils/cdp';
import { formatCollateralizationRatio, formatLiquidationPrice } from 'utils/ui';
import SetMax from 'components/SetMax';
import AllowanceToggle from 'components/AllowanceToggle';
import ProxyToggle from 'components/ProxyToggle';

const Deposit = ({ cdpId, reset }) => {
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();
  const [storeState] = useStore();
  const cdp = getCdp(cdpId, storeState);
  const { symbol } = cdp.currency;

  const gemBalances = useWalletBalances();
  const gemBalance = gemBalances[symbol] || 0;
  const {
    hasAllowance,
    setAllowance,
    allowanceLoading,
    startedWithoutAllowance
  } = useTokenAllowance(symbol);
  const {
    setupProxy,
    proxyLoading,
    startedWithoutProxy,
    hasProxy
  } = useProxy();

  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [collateralizationRatio, setCollateralizationRatio] = useState(0);

  const collateralPrice = getCollateralPrice(cdp);
  const collateralAmount = getCollateralAmount(cdp, true, 9);
  const debtAmount = getDebtAmount(cdp);

  const [amount, setAmount, onAmountChange, amountErrors] = useValidatedInput(
    '',
    {
      maxFloat: gemBalance,
      minFloat: 0,
      isFloat: true
    },
    {
      maxFloat: () =>
        lang.formatString(lang.action_sidebar.insufficient_balance, symbol)
    }
  );
  const valid = amount && !amountErrors && hasAllowance && hasProxy;

  const setMax = () => setAmount(gemBalance);

  const showProxyToggle = !proxyLoading && !hasProxy;

  useEffect(() => {
    let val = parseFloat(amount);
    val = isNaN(val) ? 0 : val;
    const { liquidationPrice, collateralizationRatio } = calcCDPParams({
      ilkData: cdp,
      gemsToLock: collateralAmount + val,
      daiToDraw: debtAmount
    });
    setLiquidationPrice(liquidationPrice);
    setCollateralizationRatio(collateralizationRatio);
  }, [amount, cdp, collateralAmount, debtAmount]);

  const deposit = () => {
    newTxListener(
      maker
        .service('mcd:cdpManager')
        .lock(cdpId, cdp.ilk, cdp.currency(parseFloat(amount))),
      lang.formatString(lang.transactions.depositing_gem, symbol)
    );
    reset();
  };

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
          after={<SetMax onClick={setMax} />}
          failureMessage={amountErrors}
          data-testid="deposit-input"
        />
      </Grid>
      {(showProxyToggle ||
        !hasAllowance ||
        startedWithoutAllowance ||
        startedWithoutProxy) && (
        <Grid gridRowGap="s">
          {(startedWithoutProxy || showProxyToggle) && (
            <ProxyToggle
              isLoading={proxyLoading}
              isComplete={!!hasProxy}
              onToggle={setupProxy}
              disabled={!!hasProxy}
            />
          )}
          {(startedWithoutAllowance || !hasAllowance) && (
            <AllowanceToggle
              tokenDisplayName={symbol}
              isLoading={allowanceLoading}
              isComplete={hasAllowance}
              onToggle={setAllowance}
              disabled={!hasProxy || hasAllowance}
            />
          )}
        </Grid>
      )}
      <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
        <Button onClick={deposit} disabled={!valid}>
          {lang.actions.deposit}
        </Button>
        <Button variant="secondary-outline" onClick={reset}>
          {lang.cancel}
        </Button>
      </Grid>
      <InfoContainer>
        <Info
          title={lang.action_sidebar.current_account_balance}
          body={`${gemBalance && gemBalance.toFixed(6)} ${symbol}`}
        />
        <Info
          title={lang.formatString(
            lang.action_sidebar.gem_usd_price_feed,
            symbol
          )}
          body={`${collateralPrice} ${symbol}/USD`}
        />
        <Info
          title={lang.action_sidebar.new_liquidation_price}
          body={formatLiquidationPrice(liquidationPrice, symbol)}
        />
        <Info
          title={lang.action_sidebar.new_collateralization_ratio}
          body={formatCollateralizationRatio(collateralizationRatio)}
        />
      </InfoContainer>
    </Grid>
  );
};
export default Deposit;
