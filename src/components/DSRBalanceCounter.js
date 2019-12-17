import React, { useEffect, useState } from 'react';
import useInterval from 'hooks/useInterval';
import BigNumber from 'bignumber.js';
import useWalletBalances from 'hooks/useWalletBalances';
import useStore from 'hooks/useStore';
import { Text } from '@makerdao/ui-components-core';
import styled from 'styled-components';

const TextMono = styled(Text)`
  font-family: SF Mono;
`;

const oneThousand = new BigNumber('1000');
const oneHundredThousand = new BigNumber('100000');

function DSRBalanceCounter() {
  const [
    {
      savings: { rho, dsr: daiSavingsRate }
    }
  ] = useStore();
  const { DSR } = useWalletBalances();

  const [tickingDSR, setTickingDSR] = useState(new BigNumber(0));
  const [amountChange, setAmountChange] = useState(new BigNumber(0));

  const rateOfChange = 10;

  const decimaslOffset = DSR.lt(oneThousand)
    ? 8
    : DSR.lt(oneHundredThousand)
    ? 6
    : 4;

  useEffect(() => {
    if (DSR) {
      setAmountChange(
        daiSavingsRate
          .times(DSR)
          .minus(DSR)
          .div(rateOfChange)
      );
      setTickingDSR(DSR);
    }
  }, [DSR, daiSavingsRate]);
  const show = rho && daiSavingsRate;

  useInterval(() => {
    setTickingDSR(tickingDSR.plus(amountChange));
  }, 1000 / rateOfChange);

  return (
    <TextMono t="h2" color="darkLavender">
      {show ? tickingDSR.toFixed(decimaslOffset) : '--'}
    </TextMono>
  );
}

export default DSRBalanceCounter;
