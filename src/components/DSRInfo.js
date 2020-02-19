import React, { useReducer, useEffect, useState, useRef } from 'react';
import BigNumber from 'bignumber.js';

import TextMono from 'components/TextMono';
import { Flex, Text, Box } from '@makerdao/ui-components-core';
import useStore from 'hooks/useStore';
import useWalletBalances from 'hooks/useWalletBalances';
import useLanguage from 'hooks/useLanguage';
import usePrevious from 'hooks/usePrevious';
import useProxy from 'hooks/useProxy';
import useMaker from 'hooks/useMaker';
import theme from '../styles/theme';
import { InfoContainerRow, CdpViewCard } from './CDPDisplay/subcomponents';
import { TextBlock } from 'components/Typography';

function Ticker({ amount, increment, decimals, ...props }) {
  const [counter, setCounter] = useState(amount);

  const requestRef = useRef();
  const previousTimeRef = useRef(0);

  const animate = time => {
    const deltaTime = time - previousTimeRef.current;
    if (deltaTime > 0) {
      setCounter(prevCount => deltaTime * increment + prevCount);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TextMono {...props}>
      {counter ? counter.toFixed(decimals) : (0).toFixed(decimals)}
    </TextMono>
  );
}

const initialState = {
  balance: BigNumber(0),
  earnings: BigNumber(0),
  amountChange: BigNumber(0),
  decimalsToShow: 4,
  interestAccrued: 0,
  rawEarnings: 0,
  amountChangeMillisecond: BigNumber(0.000001),
  fetchedEarnings: false,
  fetchingEarnings: false,
  initialised: false,
  renderUpdates: false,
  earningsDispatched: false
};

function DSRInfo() {
  const { lang } = useLanguage();
  const [
    {
      savings: { dsr: daiSavingsRate, rho, yearlyRate }
    }
  ] = useStore();
  const { DSR } = useWalletBalances();
  const { proxyAddress } = useProxy();
  const { maker, account } = useMaker();

  const emSize = parseInt(getComputedStyle(document.body).fontSize);
  const pxBreakpoint = parseInt(theme.breakpoints.l) * emSize;
  const isMobile = document.documentElement.clientWidth < pxBreakpoint;

  const address = account?.address;
  const prevAddress = usePrevious(address);
  const prevDsr = usePrevious(DSR.toNumber());
  const prevProxy = usePrevious(proxyAddress);
  const mobileViewChange = usePrevious(isMobile);
  const dsrChanged = prevDsr !== DSR.toNumber();

  const addressChanged =
    address !== undefined &&
    prevAddress !== undefined &&
    prevAddress !== address;

  const [
    {
      balance,
      earnings,
      amountChange,
      decimalsToShow,
      rawEarnings,
      interestAccrued,
      amountChangeMillisecond,
      fetchedEarnings,
      fetchingEarnings,
      initialised,
      renderUpdates,
      earningsDispatched
    },
    dispatch
  ] = useReducer((state, data) => ({ ...state, ...data }), initialState);

  const fetchEarnings = async () => {
    const etd = await maker
      .service('mcd:savings')
      .getEarningsToDate(proxyAddress);
    dispatch({
      fetchingEarnings: false,
      fetchedEarnings: true,
      rawEarnings: etd
    });
  };

  useEffect(() => {
    if (
      proxyAddress !== undefined &&
      prevProxy !== proxyAddress &&
      !fetchedEarnings &&
      !fetchingEarnings
    ) {
      dispatch({ fetchingEarnings: true });
      fetchEarnings();
    }

    if (addressChanged) {
      dispatch(initialState);
    }

    if (dsrChanged) {
      dispatch({ initialised: false });
      if (DSR.gt(0)) {
        const amountChangePerSecond = daiSavingsRate.minus(1).times(DSR);
        const accruedInterestSinceDrip = amountChangePerSecond.times(
          Math.floor(Date.now() / 1000) - rho
        );
        const amountChangePerMillisecond = amountChangePerSecond.div(1000);
        dispatch({
          balance: DSR.plus(accruedInterestSinceDrip),
          amountChange: amountChangePerMillisecond,
          interestAccrued: accruedInterestSinceDrip,
          decimalsToShow: amountChangePerMillisecond.times(100).e * -1,
          amountChangeMillisecond: amountChangePerMillisecond,
          initialised: true,
          renderUpdates: true
        });
      } else {
        dispatch({
          balance: BigNumber(0),
          amountChange: BigNumber(0),
          initialised: true,
          decimalsToShow: 4
        });
      }
    }

    if (fetchedEarnings && initialised && !earningsDispatched) {
      dispatch({
        earningsDispatched: true,
        earnings: rawEarnings.toBigNumber().plus(interestAccrued)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    addressChanged,
    dsrChanged,
    fetchedEarnings,
    fetchingEarnings,
    renderUpdates,
    proxyAddress
  ]);

  useEffect(() => {
    dispatch({
      decimalsToShow: !isMobile
        ? amountChangeMillisecond.times(100).e * -1
        : DSR.lt(1000)
        ? 8
        : DSR.lt(100000)
        ? 6
        : 4
    });
  }, [mobileViewChange]); // eslint-disable-line

  return (
    <CdpViewCard title={lang.save.dai_locked_dsr}>
      <Flex alignItems="flex-end" mt="s" mb="xs">
        <Ticker
          key={`${proxyAddress}.${balance.toString()}.${amountChange}.${decimalsToShow}`}
          amount={balance.toNumber()}
          increment={amountChange.toNumber()}
          decimals={decimalsToShow}
          t="h2"
        />
        <Box>
          <Text.h4 mb=".175rem" ml="s">
            DAI
          </Text.h4>
        </Box>
      </Flex>
      <InfoContainerRow
        title={
          <TextBlock fontSize="l">{lang.save.savings_earned_to_date}</TextBlock>
        }
        value={
          <>
            {earningsDispatched ? (
              <Ticker
                key={`${proxyAddress}.${earnings.toString()}.${amountChange}.${decimalsToShow}`}
                amount={earnings.toNumber()}
                increment={amountChange.toNumber()}
                decimals={decimalsToShow}
                t="body"
              />
            ) : (
              <TextMono t="body">{(0).toFixed(decimalsToShow)}</TextMono>
            )}
            <Text ml="xs">DAI</Text>
          </>
        }
      />
      <InfoContainerRow
        title={lang.save.dai_savings_rate}
        value={
          yearlyRate ? <TextMono>{yearlyRate.toFixed(2)}%</TextMono> : '--'
        }
      />
    </CdpViewCard>
  );
}

export default DSRInfo;
