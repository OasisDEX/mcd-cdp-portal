import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { Text, Input, Grid, Link, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useMaker from 'hooks/useMaker';
import useStore from 'hooks/useStore';
import {
  getCdp,
  getDebtAmount,
  getCollateralPrice,
  getCollateralAmount
} from 'reducers/cdps';
import { calcCDPParams } from 'utils/cdp';
import { formatCollateralizationRatio, formatLiquidationPrice } from 'utils/ui';
import { MAX_UINT_BN } from 'utils/units';
import LoadingToggle from 'components/LoadingToggle';

import lang from 'languages';

const initialState = {
  startedWithoutProxy: false,
  startedWithoutAllowance: false,
  proxyAddress: null,
  hasAllowance: false,
  proxyLoading: false,
  allowanceLoading: false
};

const Deposit = ({ cdpId, reset }) => {
  const { maker, account, newTxListener } = useMaker();
  const [firstLoadComplete, setFirstLoadComplete] = useState(false);
  const [amount, setAmount] = useState('');
  const [gemBalance, setGemBalance] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [collateralizationRatio, setCollateralizationRatio] = useState(0);

  const [userState, updateUserState] = useReducer(
    (state, updates) => ({ ...state, ...updates }),
    initialState
  );
  const [storeState] = useStore();
  const cdp = getCdp(cdpId, storeState);

  const collateralPrice = getCollateralPrice(cdp);
  const collateralAmount = getCollateralAmount(cdp, true, 9);
  const debtAmount = getDebtAmount(cdp);

  const { symbol } = cdp.currency;

  maker
    .getToken(symbol)
    .balance()
    .then(balance => {
      setGemBalance(balance.toNumber());
    });

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

  const checkForProxyAndAllowance = useCallback(async () => {
    const proxyAddress = await maker.service('proxy').getProxyAddress();
    const token = maker.getToken(symbol);
    const hasAllowance =
      symbol === 'ETH' ||
      (proxyAddress &&
        (await token.allowance(maker.currentAddress(), proxyAddress)).eq(
          MAX_UINT_BN
        ));

    updateUserState({ proxyAddress, hasAllowance });

    return {
      proxyAddress,
      hasAllowance
    };
  }, [maker, symbol]);

  useEffect(() => {
    setFirstLoadComplete(false);
  }, [account]);

  useEffect(() => {
    (async () => {
      const { proxyAddress, hasAllowance } = await checkForProxyAndAllowance();
      if (!firstLoadComplete) {
        updateUserState({
          startedWithoutProxy: !proxyAddress,
          startedWithoutAllowance: !hasAllowance
        });
        setFirstLoadComplete(true);
      }
    })();
  }, [maker, account, firstLoadComplete, checkForProxyAndAllowance]);

  const setupProxy = useCallback(async () => {
    try {
      updateUserState({ proxyLoading: true });
      const txPromise = maker.service('proxy').ensureProxy();
      newTxListener(txPromise, lang.transactions.setting_up_proxy);
      const proxyAddress = await txPromise;
      updateUserState({
        proxyAddress,
        proxyLoading: false
      });
    } catch (err) {
      updateUserState({
        proxyLoading: false
      });
    }
  }, [maker, newTxListener]);

  const setAllowance = useCallback(async () => {
    try {
      updateUserState({ allowanceLoading: true });
      const token = maker.getToken(symbol);
      const txPromise = token.approveUnlimited(userState.proxyAddress);
      newTxListener(
        txPromise,
        lang.formatString(lang.transactions.unlocking_token, symbol)
      );
      await txPromise;
      updateUserState({
        hasAllowance: true,
        allowanceLoading: false
      });
    } catch (err) {
      updateUserState({
        allowanceLoading: false
      });
    }
  }, [maker, newTxListener, symbol, userState.proxyAddress]);

  const deposit = () => {
    newTxListener(
      maker
        .service('mcd:cdpManager')
        .lock(cdpId, cdp.ilk, cdp.currency(parseFloat(amount)), MDAI(0)),
      lang.formatString(lang.transactions.depositing_gem, symbol)
    );
    reset();
  };

  const setMax = () => setAmount(gemBalance);
  const lessThanBalance = amount === '' || parseFloat(amount) <= gemBalance;
  const inputNotEmpty = amount !== '';
  const isNonZero = amount !== '' && amount > 0;
  const valid =
    inputNotEmpty &&
    isNonZero &&
    lessThanBalance &&
    userState.hasAllowance &&
    userState.proxyAddress;
  const errorMessage = !lessThanBalance
    ? lang.formatString(lang.action_sidebar.insufficient_balance, symbol)
    : '';

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
          onChange={evt => setAmount(evt.target.value)}
          placeholder={`0.00 ${symbol}`}
          after={
            <Link fontWeight="medium" onClick={setMax}>
              {lang.action_sidebar.set_max}
            </Link>
          }
          failureMessage={errorMessage}
          data-testid="deposit-input"
        />
      </Grid>
      {(userState.startedWithoutProxy || userState.startedWithoutAllowance) && (
        <Grid gridRowGap="s">
          {(userState.startedWithoutProxy || !userState.proxyAddress) && (
            <LoadingToggle
              completeText={lang.action_sidebar.proxy_created}
              loadingText={lang.action_sidebar.creating_proxy}
              defaultText={lang.action_sidebar.create_proxy}
              isLoading={userState.proxyLoading}
              isComplete={!!userState.proxyAddress}
              onToggle={setupProxy}
              disabled={!!userState.proxyAddress}
            />
          )}
          {(userState.startedWithoutAllowance || !userState.hasAllowance) && (
            <LoadingToggle
              completeText={lang.formatString(
                lang.action_sidebar.token_unlocked,
                symbol
              )}
              loadingText={lang.formatString(
                lang.action_sidebar.unlocking_token,
                symbol
              )}
              defaultText={lang.formatString(
                lang.action_sidebar.unlock_token,
                symbol
              )}
              isLoading={userState.allowanceLoading}
              isComplete={userState.hasAllowance}
              onToggle={setAllowance}
              disabled={!userState.proxyAddress || userState.hasAllowance}
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
          body={`${gemBalance.toFixed(6)} ${symbol}`}
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
