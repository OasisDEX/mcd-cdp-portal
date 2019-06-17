import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { Text, Input, Grid, Link, Button } from '@makerdao/ui-components-core';
import SidebarActionLayout from 'layouts/SidebarActionLayout';
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

const initialState = {
  proxyAddress: null,
  hasAllowance: null,
  startedWithoutProxy: false,
  startedWithoutAllowance: false,
  allowanceLoading: false,
  proxyLoading: false
};

const Payback = ({ cdpId, reset }) => {
  const { maker, account, newTxListener } = useMaker();
  const [amount, setAmount] = useState('');
  const [firstLoadComplete, setFirstLoadComplete] = useState(false);
  const [daiBalance, setDaiBalance] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [collateralizationRatio, setCollateralizationRatio] = useState(0);

  const [userState, updateUserState] = useReducer(
    (state, updates) => ({ ...state, ...updates }),
    initialState
  );

  const checkForProxyAndAllowance = useCallback(async () => {
    const proxyAddress = await maker.service('proxy').getProxyAddress();
    const token = maker.getToken('MDAI');
    const hasAllowance =
      proxyAddress &&
      (await token.allowance(maker.currentAddress(), proxyAddress)).eq(
        MAX_UINT_BN
      );

    updateUserState({ proxyAddress, hasAllowance });

    return {
      proxyAddress,
      hasAllowance
    };
  }, [maker]);

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
  }, [maker, account, firstLoadComplete]);

  const setupProxy = async () => {
    try {
      updateUserState({ proxyLoading: true });
      const txPromise = maker.service('proxy').ensureProxy();
      newTxListener(txPromise, lang.transactions.setting_up_proxy);
      const proxyAddress = await txPromise;
      updateUserState({ proxyAddress, proxyLoading: false });
    } catch (e) {
      updateUserState({ proxyLoading: false });
    }
  };

  const setAllowance = async () => {
    const { proxyAddress } = userState;
    try {
      updateUserState({ allowanceLoading: true });

      const daiToken = maker.getToken('MDAI');
      const txPromise = daiToken.approveUnlimited(proxyAddress);
      newTxListener(
        txPromise,
        lang.formatString(lang.transactions.unlocking_token, 'DAI')
      );
      await txPromise;
      updateUserState({ hasAllowance: true, allowanceLoading: false });
    } catch (e) {
      updateUserState({ allowanceLoading: false });
    }
  };

  const [storeState] = useStore();
  const cdp = getCdp(cdpId, storeState);

  const collateralAmount = getCollateralAmount(cdp, true, 9);
  const debtAmount = getDebtAmount(cdp);

  maker
    .getToken(MDAI)
    .balance()
    .then(daiBalance => setDaiBalance(daiBalance.toNumber()));

  useEffect(() => {
    const amountToPayback = parseFloat(amount || 0);
    const { liquidationPrice, collateralizationRatio } = calcCDPParams({
      ilkData: cdp,
      gemsToLock: collateralAmount,
      daiToDraw: Math.max(debtAmount - amountToPayback, 0)
    });

    setLiquidationPrice(liquidationPrice);
    setCollateralizationRatio(collateralizationRatio);
  }, [amount, cdp]);

  const setMax = () => setAmount(Math.min(debtAmount, daiBalance));

  const payback = () => {
    newTxListener(
      maker
        .service('mcd:cdpManager')
        .wipeAndFree(cdpId, cdp.ilk, MDAI(parseFloat(amount)), cdp.currency(0)),
      lang.transactions.pay_back_dai
    );
    reset();
  };

  const amt = parseFloat(amount);
  const isLessThanBalance = amt <= daiBalance;
  const isLessThanDebt = amt <= debtAmount;
  const isNonZero = amount !== '' && amt > 0;
  const canPayBack =
    isNonZero && isLessThanDebt && isLessThanBalance && userState.hasAllowance;

  let errorMessage = null;
  if (!isLessThanBalance && isNonZero)
    errorMessage = lang.formatString(
      lang.action_sidebar.insufficient_balance,
      'DAI'
    );
  if (!isLessThanDebt && isNonZero)
    errorMessage = lang.action_sidebar.cannot_payback_more_than_owed;

  return (
    <SidebarActionLayout onClose={reset}>
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
            after={
              <Link onClick={setMax} fontWeight="medium">
                {lang.action_sidebar.set_max}
              </Link>
            }
          />
        </Grid>
        {(userState.startedWithoutProxy ||
          userState.startedWithoutAllowance) && (
          <Grid gridRowGap="s">
            {(userState.startedWithoutProxy || !userState.proxyAddress) && (
              <LoadingToggle
                completeText={lang.action_sidebar.proxy_created}
                loadingText={lang.action_sidebar.creating_proxy}
                defaultText={lang.action_sidebar.create_proxy}
                isLoading={userState.proxyLoading}
                isComplete={!!userState.proxyAddress}
                disabled={!!userState.proxyAddress}
                onToggle={setupProxy}
              />
            )}
            {(userState.startedWithoutAllowance || !userState.hasAllowance) && (
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
                isLoading={userState.allowanceLoading}
                isComplete={userState.hasAllowance}
                onToggle={setAllowance}
                disabled={!userState.proxyAddress || userState.hasAllowance}
              />
            )}
          </Grid>
        )}
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
          <Info
            title={lang.action_sidebar.dai_debt}
            body={`${debtAmount} DAI`}
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
    </SidebarActionLayout>
  );
};
export default Payback;
