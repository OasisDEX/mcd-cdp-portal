import { useEffect, useReducer, useState } from 'react';
import useInterval from 'hooks/useInterval';
import BigNumber from 'bignumber.js';

import useWalletBalances from 'hooks/useWalletBalances';
import useStore from 'hooks/useStore';
import useProxy from 'hooks/useProxy';
import useMaker from 'hooks/useMaker';

const oneThousand = new BigNumber('1000');
const oneHundredThousand = new BigNumber('100000');

const initialState = {
  balance: new BigNumber(0),
  earnings: new BigNumber(0),
  amountChange: new BigNumber(0),
  earningsFlag: false
};

const UPDATE_BALANCE = 'updateBalance';
const UPDATE_EARNINGS = 'updateEarnings';
const UPDATE_EARNINGS_AND_BALANCE = 'updateEarningsAndBalance';

const savingsDaiReducer = (state, { type, payload }) => {
  const { balance, earnings, amountChange, earningsFlag } = state;
  switch (type) {
    case UPDATE_BALANCE:
      return { ...state, ...payload };
    case UPDATE_EARNINGS:
      return { ...state, ...payload, earningsFlag: true };
    case UPDATE_EARNINGS_AND_BALANCE:
      return {
        balance: balance.plus(amountChange),
        earnings: earningsFlag ? earnings.plus(amountChange) : earnings,
        amountChange,
        earningsFlag
      };
    default:
      return state;
  }
};

function useSavingsDai(rateOfChange = 10) {
  const [
    {
      savings: { dsr: daiSavingsRate, rho }
    }
  ] = useStore();
  const { DSR } = useWalletBalances();
  const { proxyAddress } = useProxy();
  const { maker } = useMaker();

  const [{ balance, earnings, earningsFlag }, dispatch] = useReducer(
    savingsDaiReducer,
    initialState
  );
  const [latestETD, setLatestETD] = useState(new BigNumber(0));
  const [
    interestAccruedSinceLastDrip,
    setInterestAccruedSinceLastDrip
  ] = useState(new BigNumber(0));

  const decimalsToShow = DSR.lt(oneThousand)
    ? 8
    : DSR.lt(oneHundredThousand)
    ? 6
    : 4;

  useEffect(() => {
    if (DSR) {
      const amountChangePerSecond = daiSavingsRate.times(DSR).minus(DSR);
      const amountChangePerInterval = amountChangePerSecond.div(rateOfChange);
      const now = Math.floor(Date.now() / 1000);
      const secondsSinceLastDrip = now - rho;
      const interestAccrued = amountChangePerSecond.times(secondsSinceLastDrip);
      setInterestAccruedSinceLastDrip(interestAccrued);
      dispatch({
        type: UPDATE_BALANCE,
        payload: {
          balance: DSR.plus(interestAccrued),
          amountChange: amountChangePerInterval
        }
      });
    }
  }, [DSR, daiSavingsRate, maker, proxyAddress, rateOfChange, rho]);

  useEffect(() => {
    if (!earningsFlag && proxyAddress && interestAccruedSinceLastDrip.gt(0)) {
      (async function() {
        const etd = await maker
          .service('mcd:savings')
          .getEarningsToDate(proxyAddress);

        setLatestETD(etd);
        dispatch({
          type: UPDATE_EARNINGS,
          payload: {
            earnings: etd.toBigNumber().plus(interestAccruedSinceLastDrip)
          }
        });
      })();
    }
  }, [proxyAddress, interestAccruedSinceLastDrip, earningsFlag, maker]);

  useInterval(() => {
    dispatch({ type: UPDATE_EARNINGS_AND_BALANCE });
  }, 1000 / rateOfChange);

  return {
    savingsDaiBalance: DSR,
    savingsDaiEarned: latestETD,
    estimatedSavingsDaiBalance: balance,
    estimatedSavingsDaiEarned: earnings,
    decimalsToShow
  };
}

export default useSavingsDai;
