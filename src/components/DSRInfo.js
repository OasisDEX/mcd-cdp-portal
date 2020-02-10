import React, { useReducer, useEffect, useState, useRef } from 'react';
import BigNumber from 'bignumber.js';

import TextMono from 'components/TextMono';
import {
  Flex,
  Card,
  CardBody,
  Text,
  Table
} from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';
import usePrevious from 'hooks/usePrevious';
import useMaker from 'hooks/useMaker';
import useSavings from 'hooks/useSavings';

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

  const mobileDecimals = isMobile
    ? decimalsToShow
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
        decimalsToShow: !isMobile
          ? daiLockedInDsr.gt(0)
            ? amountChangePerMillisecond.times(100).e * -1
            : initialState.decimalsToShow
          : mobileDecimals
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
        decimalsToShow: !isMobile
          ? amountChange.times(100).e * -1
          : daiLockedInDsr.lt(1000)
          ? 8
          : daiLockedInDsr.lt(100000)
          ? 6
          : 4
      });
    }
  }, [mobileViewChange]); // eslint-disable-line

  return (
    <Flex py="s" height="100%" flexDirection="column">
      <Text.h4>{lang.save.dai_locked_dsr}</Text.h4>
      <Card px={{ s: 'm', m: 'l' }} py="s" mt="s" flexGrow="1">
        <CardBody px="l" py="m">
          {fetchedSavings ? (
            <Ticker
              key={`${balance.toNumber()}.${amountChange.toNumber()}.${decimalsToShow}`}
              amount={balance.toNumber()}
              increment={amountChange.toNumber()}
              decimals={decimalsToShow}
              t="h2"
            />
          ) : (
            <TextMono t="h2">{(0).toFixed(4)}</TextMono>
          )}
          <Text t="h5"> DAI</Text>
          <Text.p t="h5" mt="s" color="steel">
            {daiLockedInDsr?.toFixed(4)} USD
          </Text.p>
        </CardBody>
        <CardBody px="l">
          <Table width="100%">
            <Table.tbody>
              <Table.tr>
                <Table.td>
                  <Text t="body">{lang.save.savings_earned_to_date}</Text>
                </Table.td>
                <Table.td textAlign="right">
                  {earningsDispatched ? (
                    <Ticker
                      key={`${proxyAddress}.${earnings.toString()}.${amountChange}.${decimalsToShow}`}
                      amount={earnings.toNumber()}
                      increment={amountChange.toNumber()}
                      decimals={decimalsToShow}
                      t="body"
                    />
                  ) : (
                    <TextMono t="body">{(0).toFixed(4)}</TextMono>
                  )}
                  <Text t="body"> DAI</Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text t="body">{lang.save.dai_savings_rate}</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text t="body">
                    {annualDaiSavingsRate
                      ? `${annualDaiSavingsRate.toFixed(2)}%`
                      : '--'}
                  </Text>
                </Table.td>
              </Table.tr>
            </Table.tbody>
          </Table>
        </CardBody>
      </Card>
    </Flex>
  );
}

export default DSRInfo;
