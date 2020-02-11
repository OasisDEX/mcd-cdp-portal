import { useEffect, useReducer } from 'react';
import useMaker from 'hooks/useMaker';
import BigNumber from 'bignumber.js';
import { DSR_DAI } from '@makerdao/dai-plugin-mcd';

const initialState = {
  proxyAddress: undefined,
  annualDaiSavingsRate: BigNumber(0),
  daiSavingsRate: BigNumber(1),
  dateEarningsLastAccrued: Date.now(),
  daiLockedInDsr: DSR_DAI(0),
  fetchedSavings: false
};

function useSavings(address) {
  const { maker } = useMaker();
  const [{ daiLockedInDsr, ...savings }, dispatch] = useReducer(
    (state, data) => ({ ...state, ...data }),
    initialState
  );

  useEffect(() => {
    let sub = maker
      .service('multicall')
      .watch('savings', address)
      .subscribe(updates => {
        dispatch({ fetchedSavings: true, ...updates });
      });
    return () => sub.unsubscribe();
  }, [maker, address]);

  return {
    daiLockedInDsr: daiLockedInDsr.toBigNumber(),
    ...savings
  };
}

export default useSavings;
