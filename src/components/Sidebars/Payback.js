import React from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import lang from 'languages';
import round from 'lodash/round';

import { formatCollateralizationRatio, formatLiquidationPrice } from 'utils/ui';
import { calcCDPParams } from 'utils/cdp';
import { minimum } from 'utils/bignumber';

import useMaker from 'hooks/useMaker';
import useProxy from 'hooks/useProxy';
import useStore from 'hooks/useStore';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useWalletBalances from 'hooks/useWalletBalances';
import useValidatedInput from 'hooks/useValidatedInput';

import { getCdp, getDebtAmount, getCollateralAmount } from 'reducers/cdps';

import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import ProxyToggle from 'components/ProxyToggle';
import AllowanceToggle from 'components/AllowanceToggle';
import SetMax from 'components/SetMax';

const Payback = ({ cdpId, reset }) => {
  const { maker, newTxListener } = useMaker();
  const balances = useWalletBalances();
  const daiBalance = balances.MDAI;

  const {
    hasAllowance,
    setAllowance,
    allowanceLoading,
    startedWithoutAllowance
  } = useTokenAllowance('MDAI');
  const {
    setupProxy,
    proxyLoading,
    startedWithoutProxy,
    hasProxy
  } = useProxy();

  const [storeState] = useStore();
  const cdp = getCdp(cdpId, storeState);
  const collateralAmount = getCollateralAmount(cdp, true, 9);
  const debtAmount = getDebtAmount(cdp, false);

  const [amount, setAmount, onAmountChange, amountErrors] = useValidatedInput(
    '',
    {
      maxFloat: Math.min(daiBalance, debtAmount),
      minFloat: 0,
      isFloat: true
    },
    {
      maxFloat: amount => {
        return daiBalance < parseFloat(amount)
          ? lang.formatString(lang.action_sidebar.insufficient_balance, 'DAI')
          : lang.action_sidebar.cannot_payback_more_than_owed;
      }
    }
  );

  const amountToPayback = parseFloat(amount || 0);
  const { liquidationPrice, collateralizationRatio } = calcCDPParams({
    ilkData: cdp,
    gemsToLock: collateralAmount,
    daiToDraw: Math.max(debtAmount - amountToPayback, 0)
  });

  const setMax = () =>
    debtAmount && daiBalance && setAmount(minimum(debtAmount, daiBalance));

  const payback = () => {
    const cdpManager = maker.service('mcd:cdpManager');
    newTxListener(
      debtAmount !== amount
        ? cdpManager.wipe(cdpId, MDAI(parseFloat(amount)))
        : cdpManager.wipeAll(cdpId),
      lang.transactions.pay_back_dai
    );
    reset();
  };

  const showProxyToggle = !proxyLoading && !hasProxy;
  const valid = amount && !amountErrors && hasProxy && hasAllowance;

  return (
    <Grid gridRowGap="m">
      <Grid gridRowGap="s">
        <Text.h4 color="darkLavender">
          {lang.action_sidebar.payback_title}
        </Text.h4>
        <Text.p t="body">{lang.action_sidebar.payback_description}</Text.p>
        <Input
          type="number"
          value={amount}
          min="0"
          onChange={onAmountChange}
          placeholder="0.00 DAI"
          failureMessage={amountErrors}
          data-testid="payback-input"
          after={<SetMax onClick={setMax} />}
        />
      </Grid>
      {(showProxyToggle ||
        !hasAllowance ||
        startedWithoutAllowance ||
        startedWithoutProxy) && (
        <Grid gridRowGap="s" data-testid="toggle-container">
          {(startedWithoutProxy || showProxyToggle) && (
            <ProxyToggle
              isLoading={proxyLoading}
              isComplete={!!hasProxy}
              onToggle={setupProxy}
              disabled={!!hasProxy}
              data-testid="proxy-toggle"
            />
          )}
          {(startedWithoutAllowance || !hasAllowance) && (
            <AllowanceToggle
              tokenDisplayName={'DAI'}
              isLoading={allowanceLoading}
              isComplete={hasAllowance}
              onToggle={setAllowance}
              disabled={!hasProxy || hasAllowance}
              data-testid="allowance-toggle"
            />
          )}
        </Grid>
      )}
      <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
        <Button disabled={!valid} onClick={payback}>
          {lang.actions.pay_back}
        </Button>
        <Button variant="secondary-outline" onClick={reset}>
          {lang.cancel}
        </Button>
      </Grid>
      <InfoContainer>
        <Info
          title={lang.action_sidebar.dai_balance}
          body={`${daiBalance && daiBalance.toFixed(6)} DAI`}
        />
        <Info
          title={lang.action_sidebar.dai_debt}
          body={`${round(debtAmount, 6)} DAI`}
        />
        <Info
          title={lang.action_sidebar.new_liquidation_price}
          body={formatLiquidationPrice(liquidationPrice, cdp.currency.symbol)}
        />
        <Info
          title={lang.action_sidebar.new_collateralization_ratio}
          body={formatCollateralizationRatio(collateralizationRatio)}
        />
      </InfoContainer>
    </Grid>
  );
};
export default Payback;
