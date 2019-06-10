import React, { useState, useEffect, useReducer } from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import {
  Box,
  Text,
  Input,
  Grid,
  Link,
  Button,
  Toggle,
  Loader
} from '@makerdao/ui-components-core';
import SidebarActionLayout from 'layouts/SidebarActionLayout';
import useMaker from '../../hooks/useMaker';
import {
  formatCollateralizationRatio,
  formatLiquidationPrice
} from '../../utils/ui';
import { calcCDPParams } from '../../utils/cdp';
import { getColor } from 'styles/theme';
import useStore from 'hooks/useStore';
import { getCdp, getDebtAmount, getCollateralAmount } from 'reducers/cdps';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import lang from 'languages';
import { MAX_UINT_BN } from '../../utils/units';

const initialState = {
  proxyAddress: null,
  allowance: null,
  startedWithoutProxy: false,
  startedWithoutAllowance: false,
  allowanceLoading: false,
  proxyLoading: false
};

const Payback = ({ cdpId, reset }) => {
  const { maker, newTxListener } = useMaker();
  const [amount, setAmount] = useState('');
  const [daiBalance, setDaiBalance] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [collateralizationRatio, setCollateralizationRatio] = useState(0);

  const [userState, updateUserState] = useReducer(
    (state, updates) => ({ ...state, ...updates }),
    initialState
  );

  useEffect(() => {
    const init = async () => {
      const proxyAddress = await checkProxy();
      if (proxyAddress) {
        const allowance = await checkAllowance(proxyAddress);
        updateUserState({
          proxyAddress,
          allowance,
          startedWithoutAllowance: !allowance
        });
      } else {
        updateUserState({
          startedWithoutProxy: true,
          startedWithoutAllowance: true
        });
      }
    };
    init();
  }, []);

  const checkAllowance = async address => {
    const daiToken = maker.getToken('MDAI');
    return (await daiToken.allowance(maker.currentAddress(), address)).eq(
      MAX_UINT_BN
    );
  };

  const checkProxy = async () => {
    const proxy = await maker.service('proxy').getProxyAddress();
    return proxy;
  };

  const setProxy = async () => {
    try {
      updateUserState({ proxyLoading: true });
      const txPromise = maker.service('proxy').ensureProxy();
      newTxListener(txPromise, 'Setting Proxy Address');
      await txPromise;

      const proxyAddress = await checkProxy();
      if (proxyAddress) {
        updateUserState({ proxyAddress, proxyLoading: false });
      } else {
        updateUserState({ proxyLoading: false });
      }
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
      newTxListener(txPromise, 'Setting DAI Allowance');
      await txPromise;
      const allowance = await checkAllowance(proxyAddress);

      if (allowance) {
        updateUserState({ allowance, allowanceLoading: false });
      } else {
        updateUserState({ allowanceLoading: false });
      }
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
      'Paying Back DAI'
    );
    reset();
  };

  const {
    proxyAddress,
    proxyLoading,
    allowance,
    allowanceLoading,
    startedWithoutProxy,
    startedWithoutAllowance
  } = userState;
  const amt = parseFloat(amount);
  const isLessThanBalance = amt <= daiBalance;
  const isLessThanDebt = amt <= debtAmount;
  const isNonZero = amount !== '' && amt > 0;
  const canPayBack =
    isNonZero && isLessThanDebt && isLessThanBalance && allowance;

  let errorMessage = null;
  if (!isLessThanBalance && isNonZero)
    errorMessage = lang.formatString(
      lang.action_sidebar.insufficient_balance,
      'DAI'
    );
  if (!isLessThanDebt && isNonZero)
    errorMessage = lang.action_sidebar.cannot_payback_more_than_owed;

  const {
    create_proxy,
    creating_proxy,
    proxy_created,
    unlock_dai,
    unlocking_dai,
    dai_unlocked
  } = lang.action_sidebar;
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
            errorMessage={errorMessage}
            after={
              <Link onClick={setMax} fontWeight="medium">
                {lang.action_sidebar.set_max}
              </Link>
            }
          />
        </Grid>
        {startedWithoutProxy && (
          <Grid gridTemplateColumns="2fr 1fr" gridColumnGap="s">
            <Text.p t="body">
              {proxyAddress
                ? proxy_created
                : proxyLoading
                ? creating_proxy
                : create_proxy}
            </Text.p>
            {proxyLoading ? (
              <Box alignSelf="center" justifySelf="end">
                <Loader size="20" color={getColor('makerTeal')} />
              </Box>
            ) : (
              <Toggle
                active={!!proxyAddress}
                onClick={() => !proxyAddress && setProxy()}
                justifySelf="end"
              />
            )}
          </Grid>
        )}

        {startedWithoutAllowance && (
          <Grid gridTemplateColumns="2fr 1fr" gridColumnGap="s">
            <Text.p t="body">
              {allowance
                ? dai_unlocked
                : allowanceLoading
                ? unlocking_dai
                : unlock_dai}
            </Text.p>
            {allowanceLoading ? (
              <Box alignSelf="center" justifySelf="end">
                <Loader size="2rem" color={getColor('makerTeal')} />
              </Box>
            ) : (
              <Toggle
                active={!!allowance}
                onClick={() => !allowance && proxyAddress && setAllowance()}
                justifySelf="end"
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
