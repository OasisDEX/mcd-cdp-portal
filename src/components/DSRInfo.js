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
import useStore from 'hooks/useStore';
import useWalletBalances from 'hooks/useWalletBalances';
import useLanguage from 'hooks/useLanguage';
import usePrevious from 'hooks/usePrevious';
import useProxy from 'hooks/useProxy';
import useMaker from 'hooks/useMaker';
import theme from '../styles/theme';

const initialState = {
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

const FPS = 1000 / 9;

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

  const addressChanged =
    address !== undefined &&
    prevAddress !== undefined &&
    prevAddress !== address;
  const dsrChanged = prevDsr !== DSR.toNumber();

  const [
    {
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

  const requestRef = useRef();
  const previousTimeRef = useRef(0);

  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [amountChange, setAmountChange] = useState(0);

  const animate = time => {
    const deltaTime = time - previousTimeRef.current;
    if (deltaTime > FPS) {
      if (earningsDispatched) {
        setEarnings(prevEarnings => deltaTime * amountChange + prevEarnings);
        setBalance(prevBalance => deltaTime * amountChange + prevBalance);
      } else {
        setBalance(prevBalance => deltaTime * amountChange + prevBalance);
      }
      previousTimeRef.current = time;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

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

  const startTicker = () => {
    requestRef.current = requestAnimationFrame(animate);
  };

  const stopTicker = () => {
    cancelAnimationFrame(requestRef.current);
  };

  useEffect(() => {
    if (renderUpdates) {
      dispatch({ renderUpdates: false });
      startTicker();
    }

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
      setBalance(0);
      setEarnings(0);
      setAmountChange(0);
      dispatch(initialState);
      stopTicker();
    }

    if (dsrChanged) {
      stopTicker();
      dispatch({ initialised: false });
      if (DSR.gt(0)) {
        const amountChangePerSecond = daiSavingsRate.minus(1).times(DSR);
        const accruedInterestSinceDrip = amountChangePerSecond.times(
          Math.floor(Date.now() / 1000) - rho
        );
        const amountChangePerMillisecond = amountChangePerSecond.div(1000);
        dispatch({
          interestAccrued: accruedInterestSinceDrip,
          decimalsToShow: amountChangePerMillisecond.times(100).e * -1,
          amountChangeMillisecond: amountChangePerMillisecond,
          initialised: true,
          renderUpdates: true
        });
        setBalance(DSR.plus(accruedInterestSinceDrip).toNumber());
        setAmountChange(amountChangePerMillisecond.toNumber());
      } else {
        stopTicker();
        dispatch({
          initialised: true,
          decimalsToShow: 4
        });
        setBalance(0);
        setAmountChange(0);
      }
    }

    if (fetchedEarnings && (initialised || DSR.eq(0)) && !earningsDispatched) {
      stopTicker();
      dispatch({
        renderUpdates: DSR.eq(0) ? false : true,
        earningsDispatched: true
      });
      setEarnings(
        rawEarnings
          .toBigNumber()
          .plus(interestAccrued)
          .toNumber()
      );
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

  useEffect(() => {
    return () => stopTicker();
  }, []); // eslint-disable-line

  return (
    <Flex py="s" height="100%" flexDirection="column">
      <Card>
        <CardBody px="l" py="m">
          <TextMono t="h2">{balance.toFixed(decimalsToShow)}</TextMono>
          <Text t="h5"> DAI</Text>
          <Text.p t="h5" mt="s" color="steel">
            {DSR.toFixed(4)} USD
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
                  <TextMono t="body">
                    {earnings.toFixed(decimalsToShow)}
                  </TextMono>
                  <Text t="body"> DAI</Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text t="body">{lang.save.dai_savings_rate}</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text t="body">
                    {yearlyRate ? `${yearlyRate.toFixed(2)}%` : '--'}
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
