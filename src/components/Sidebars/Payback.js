import React, { useState, useEffect } from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import {
  Box,
  Text,
  Input,
  Grid,
  Link,
  Button,
  Toggle
} from '@makerdao/ui-components-core';
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
import Loader from '../Loader';

const Payback = ({ cdpId, reset }) => {
  const { maker, newTxListener } = useMaker();
  const [amount, setAmount] = useState('');
  const [daiBalance, setDaiBalance] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [collateralizationRatio, setCollateralizationRatio] = useState(0);
  const [allowanceState, setAllowanceState] = useState({
    proxyAddress: '',
    userStartedWithoutAllowance: false,
    allowance: null,
    loading: false
  });

  useEffect(() => {
    const checkProxy = async () => {
      const proxy = await maker.service('proxy').ensureProxy();
      return proxy;
    };

    const init = async () => {
      const proxy = await checkProxy();
      const allowance = await checkAllowance({ address: proxy });
      setAllowanceState({
        ...allowanceState,
        proxyAddress: proxy,
        userStartedWithoutAllowance: !allowance,
        allowance
      });
    };
    init();
  }, []);

  const checkAllowance = async ({ address }) => {
    const daiToken = maker.getToken('MDAI');
    return (await daiToken.allowance(maker.currentAddress(), address)).eq(
      MAX_UINT_BN
    );
  };

  const setAllowance = async () => {
    // if allowance is already set, do nothing
    if (allowanceState.allowance) return;

    try {
      setAllowanceState({
        ...allowanceState,
        loading: true
      });
      const daiToken = maker.getToken('MDAI');
      const { proxyAddress: address } = allowanceState;
      await daiToken.approveUnlimited(address);
      const allowance = await checkAllowance({ address });
      if (allowance) {
        setAllowanceState({
          ...allowanceState,
          allowance,
          loading: false
        });
      } else {
        setAllowanceState({ ...allowanceState, loading: false });
      }
    } catch (e) {
      setAllowanceState({ ...allowanceState, loading: false });
    }
  };

  const [storeState] = useStore();
  const cdp = getCdp(cdpId, storeState);

  const collateralAmount = getCollateralAmount(cdp);
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

  const { allowance, userStartedWithoutAllowance, loading } = allowanceState;
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
        {userStartedWithoutAllowance && (
          <Grid gridTemplateColumns="2fr 1fr" gridColumnGap="s">
            {!allowance && !loading && (
              <Text.p t="body">{lang.action_sidebar.unlock_dai}</Text.p>
            )}
            {!allowance && loading && (
              <Text.p t="body">{lang.action_sidebar.unlocking_dai}</Text.p>
            )}
            {allowance && !loading && (
              <Text.p t="body">{lang.action_sidebar.dai_unlocked}</Text.p>
            )}

            {loading ? (
              <Box alignSelf="center" justifySelf="end">
                <Loader size="20" />
              </Box>
            ) : (
              <Toggle
                active={allowance}
                onClick={setAllowance}
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
