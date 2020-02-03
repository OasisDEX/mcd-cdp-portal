import { useEffect, useReducer } from 'react';
import useInterval from 'hooks/useInterval';
import usePrevious from 'hooks/usePrevious';

import useWalletBalances from 'hooks/useWalletBalances';
import useStore from 'hooks/useStore';
import useProxy from 'hooks/useProxy';
import useMaker from 'hooks/useMaker';

const initialState = {
  balance: 0,
  earnings: 0,
  amountChange: 0,
  decimalsToShow: 4,
  earningsFlag: false
};

function useSavingsDai(rateOfChange = 20) {
  const [
    {
      savings: { dsr: daiSavingsRate, rho }
    }
  ] = useStore();

  const { DSR } = useWalletBalances();
  const { proxyAddress } = useProxy();
  const { maker, account } = useMaker();

  const address = account?.address;
  const prevAddress = usePrevious(address);
  const addressChanged =
    address !== undefined &&
    prevAddress !== undefined &&
    prevAddress !== address;

  const [
    { balance, earnings, amountChange, earningsFlag, decimalsToShow },
    dispatch
  ] = useReducer((state, data) => ({ ...state, ...data }), initialState);

  useEffect(() => {
    if (DSR.gt(0) && daiSavingsRate && proxyAddress) {
      const amountChangePerSecond = daiSavingsRate.times(DSR).minus(DSR);
      const amountChangePerInterval = amountChangePerSecond.div(rateOfChange);
      const now = Math.floor(Date.now() / 1000);
      const secondsSinceLastDrip = now - rho;
      const interestAccrued = amountChangePerSecond.times(secondsSinceLastDrip);
      dispatch({
        balance: DSR.plus(interestAccrued).toNumber(),
        amountChange: amountChangePerInterval.toNumber(),
        decimalsToShow: amountChangePerInterval.e * -1
      });

      (async () => {
        const etd = await maker
          .service('mcd:savings')
          .getEarningsToDate(proxyAddress);
        dispatch({
          earningsFlag: true,
          earnings: etd
            .toBigNumber()
            .plus(interestAccrued)
            .toNumber()
        });
      })();
    }
  }, [DSR, daiSavingsRate, address, proxyAddress, rho, rateOfChange]);

  useEffect(() => {
    if (addressChanged) {
      dispatch(initialState);
    }
  }, [addressChanged]);

  useInterval(() => {
    if (earningsFlag) {
      dispatch({
        balance: balance + amountChange,
        earnings: earnings + amountChange
      });
    } else {
      dispatch({
        balance: balance + amountChange
      });
    }
  }, 1000 / rateOfChange);

  return {
    estimatedSavingsDaiBalance: balance,
    estimatedSavingsDaiEarned: earnings,
    decimalsToShow
  };
}

export default useSavingsDai;
