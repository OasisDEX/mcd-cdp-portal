import React, { useState, useEffect, useReducer } from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { Text, Input, Grid, Link, Button } from '@makerdao/ui-components-core';
import useMaker from '../../hooks/useMaker';
import {
  formatCollateralizationRatio,
  formatLiquidationPrice
} from '../../utils/ui';
import { calcCDPParams } from '../../utils/cdp';
import useStore from 'hooks/useStore';
import { getCdp, getDebtAmount, getCollateralAmount } from 'reducers/cdps';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import lang from 'languages';
import { MAX_UINT_BN } from '../../utils/units';
import LoadingToggle from 'components/LoadingToggle';

const Payback = ({ cdpId, reset }) => {
  const { maker, account, newTxListener } = useMaker();
  const [amount, setAmount] = useState('');
  const [daiBalance, setDaiBalance] = useState(0);
  const [hasAllowance, setHasAllowance] = useState(false);

  const [storeState] = useStore();
  const cdp = getCdp(cdpId, storeState);
  const collateralAmount = getCollateralAmount(cdp, true, 9);
  const debtAmount = getDebtAmount(cdp);

  // FIXME balances should be handled by multicall
  maker
    .getToken(MDAI)
    .balance()
    .then(daiBalance => setDaiBalance(daiBalance.toNumber()));

  const amountToPayback = parseFloat(amount || 0);
  const { liquidationPrice, collateralizationRatio } = calcCDPParams({
    ilkData: cdp,
    gemsToLock: collateralAmount,
    daiToDraw: Math.max(debtAmount - amountToPayback, 0)
  });

  const setMax = () => setAmount(Math.min(debtAmount, daiBalance));

  const payback = () => {
    newTxListener(
      maker.service('mcd:cdpManager').wipe(cdpId, MDAI(parseFloat(amount))),
      lang.transactions.pay_back_dai
    );
    reset();
  };

  const amt = parseFloat(amount);
  const isLessThanBalance = amt <= daiBalance;
  const isLessThanDebt = amt <= debtAmount;
  const isNonZero = amount !== '' && amt > 0;
  const canPayBack =
    isNonZero && isLessThanDebt && isLessThanBalance && hasAllowance;

  let errorMessage = null;
  if (!isLessThanBalance && isNonZero)
    errorMessage = lang.formatString(
      lang.action_sidebar.insufficient_balance,
      'DAI'
    );
  if (!isLessThanDebt && isNonZero)
    errorMessage = lang.action_sidebar.cannot_payback_more_than_owed;

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
          onChange={evt => setAmount(evt.target.value)}
          placeholder="0.00 DAI"
          failureMessage={errorMessage}
          data-testid="payback-input"
          after={
            <Link onClick={setMax} fontWeight="medium">
              {lang.action_sidebar.set_max}
            </Link>
          }
        />
      </Grid>
      <ProxyAndAllowanceCheck
        {...{ maker, account, newTxListener, hasAllowance, setHasAllowance }}
      />
      <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
        <Button disabled={!canPayBack} onClick={payback}>
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
        <Info title={lang.action_sidebar.dai_debt} body={`${debtAmount} DAI`} />
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

const checkForProxyAndAllowance = async (
  maker,
  updateState,
  setHasAllowance
) => {
  const proxyAddress = await maker.service('proxy').getProxyAddress();
  const token = maker.getToken('MDAI');

  try {
    const hasAllowance =
      !!proxyAddress &&
      (await token.allowance(maker.currentAddress(), proxyAddress)).eq(
        MAX_UINT_BN
      );
    setHasAllowance(hasAllowance);
    updateState({
      proxyAddress,
      startedWithoutProxy: !proxyAddress,
      startedWithoutAllowance: !hasAllowance
    });
  } catch (e) {
    console.log(e);
  }
};

const setupProxy = async (maker, updateState, newTxListener) => {
  try {
    updateState({ proxyLoading: true });
    const txPromise = maker.service('proxy').ensureProxy();
    newTxListener(txPromise, lang.transactions.setting_up_proxy);
    const proxyAddress = await txPromise;
    updateState({ proxyAddress, proxyLoading: false });
  } catch (e) {
    updateState({ proxyLoading: false });
  }
};

const setAllowance = async (
  maker,
  updateState,
  newTxListener,
  proxyAddress,
  setHasAllowance
) => {
  try {
    updateState({ allowanceLoading: true });

    const daiToken = maker.getToken('MDAI');

    const txPromise = daiToken.approveUnlimited(proxyAddress);
    newTxListener(
      txPromise,
      lang.formatString(lang.transactions.unlocking_token, 'DAI')
    );

    await maker.service('transactionManager').confirm(txPromise, 1);

    setHasAllowance(true);
    updateState({ allowanceLoading: false });
  } catch (e) {
    updateState({ allowanceLoading: false });
  }
};

const initialState = {
  proxyAddress: null,
  startedWithoutProxy: false,
  startedWithoutAllowance: false,
  allowanceLoading: false,
  proxyLoading: false
};

export function ProxyAndAllowanceCheck({
  maker,
  account,
  newTxListener,
  hasAllowance,
  setHasAllowance
}) {
  const [
    {
      startedWithoutProxy,
      startedWithoutAllowance,
      proxyAddress,
      allowanceLoading,
      proxyLoading
    },
    updateState
  ] = useReducer(
    (oldState, updates) => ({ ...oldState, ...updates }),
    initialState
  );

  useEffect(() => {
    checkForProxyAndAllowance(maker, updateState, setHasAllowance);
  }, [maker, account]);

  if (!startedWithoutProxy && !startedWithoutAllowance) return null;

  return (
    <Grid gridRowGap="s" data-testid="toggle-container">
      {(startedWithoutProxy || !proxyAddress) && (
        <LoadingToggle
          completeText={lang.action_sidebar.proxy_created}
          loadingText={lang.action_sidebar.creating_proxy}
          defaultText={lang.action_sidebar.create_proxy}
          isLoading={proxyLoading}
          isComplete={!!proxyAddress}
          disabled={!!proxyAddress}
          onToggle={() => setupProxy(maker, updateState, newTxListener)}
          data-testid="proxy-toggle"
        />
      )}
      {(startedWithoutAllowance || !hasAllowance) && (
        <LoadingToggle
          completeText={lang.formatString(
            lang.action_sidebar.token_unlocked,
            'DAI'
          )}
          loadingText={lang.formatString(
            lang.action_sidebar.unlocking_token,
            'DAI'
          )}
          defaultText={lang.formatString(
            lang.action_sidebar.unlock_token,
            'DAI'
          )}
          isLoading={allowanceLoading}
          isComplete={hasAllowance}
          onToggle={() =>
            setAllowance(
              maker,
              updateState,
              newTxListener,
              proxyAddress,
              setHasAllowance
            )
          }
          disabled={!proxyAddress || hasAllowance}
          data-testid="allowance-toggle"
        />
      )}
    </Grid>
  );
}
