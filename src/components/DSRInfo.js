import React, { useReducer, useEffect, useState, useRef } from 'react';
import BigNumber from 'bignumber.js';

import TextMono from 'components/TextMono';
import { Flex, Text, Box } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';
import usePrevious from 'hooks/usePrevious';
import useMaker from 'hooks/useMaker';
import useSavings from 'hooks/useSavings';

import { InfoContainerRow, CdpViewCard } from './CDPDisplay/subcomponents';
import { TextBlock } from 'components/Typography';

const FF_DYNAMIC_DECIMALS = false;
function Ticker({ amount, increment, decimals, ...props }) {
  const [counter, setCounter] = useState(amount);
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = time => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      if (deltaTime > 0) {
        setCounter(prevCount => deltaTime * increment + prevCount);
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
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
  rawEarnings: BigNumber(0),
  amountChangeMillisecond: BigNumber(0.000001),
  fetchedEarnings: false,
  fetchingEarnings: false,
  initialised: false,
  earningsDispatched: false
};

function DSRInfo({ address, isMobile }) {
  const { lang } = useLanguage();
  const { maker } = useMaker();

  const {
    proxyAddress,
    annualDaiSavingsRate,
    daiSavingsRate,
    dateEarningsLastAccrued,
    daiLockedInDsr,
    fetchedSavings
  } = useSavings(address);

  const mobileViewChange = usePrevious(isMobile);

  const [
    {
      balance,
      earnings,
      amountChange,
      decimalsToShow,
      rawEarnings,
      interestAccrued,
      fetchedEarnings,
      fetchingEarnings,
      earningsDispatched
    },
    dispatch
  ] = useReducer((state, data) => ({ ...state, ...data }), initialState);

  const decimals =
    !isMobile && FF_DYNAMIC_DECIMALS
      ? amountChange.times(100).e * -1
      : daiLockedInDsr.eq(0)
      ? 4
      : daiLockedInDsr.lt(1000)
      ? 8
      : daiLockedInDsr.lt(100000)
      ? 6
      : 4;

  const fetchEarnings = async () => {
    const etd = await maker
      .service('mcd:savings')
      .getEarningsToDate(proxyAddress);
    dispatch({
      fetchingEarnings: false,
      fetchedEarnings: true,
      rawEarnings: etd.toBigNumber()
    });
  };

  const daiLockedString = daiLockedInDsr.toString();
  const rawEarningsString = rawEarnings.toString();

  useEffect(() => {
    if (fetchedSavings) {
      if (proxyAddress && !fetchedEarnings && !fetchingEarnings) {
        fetchEarnings();
        dispatch({ fetchingEarnings: true });
      }

      const amountChangePerSecond = daiSavingsRate
        .minus(1)
        .times(daiLockedInDsr);

      const accruedInterestSinceDrip = daiLockedInDsr.gt(0)
        ? amountChangePerSecond.times(
            Math.floor(Date.now() / 1000) -
              dateEarningsLastAccrued.getTime() / 1000
          )
        : BigNumber(0);

      const amountChangePerMillisecond = amountChangePerSecond.div(1000);
      dispatch({
        balance: daiLockedInDsr.plus(accruedInterestSinceDrip),
        amountChange: amountChangePerMillisecond,
        interestAccrued: accruedInterestSinceDrip,
        decimalsToShow: decimals
      });

      if (fetchedEarnings) {
        dispatch({
          earningsDispatched: true,
          earnings: rawEarnings.plus(interestAccrued)
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedSavings, daiLockedString, rawEarningsString, fetchedEarnings]);

  useEffect(() => {
    if (fetchedEarnings) {
      dispatch({
        decimalsToShow: decimals
      });
    }
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
          annualDaiSavingsRate ? (
            <TextMono>{annualDaiSavingsRate.toFixed(2)}%</TextMono>
          ) : (
            '--'
          )
        }
      />
    </CdpViewCard>
  );
}

export default DSRInfo;
