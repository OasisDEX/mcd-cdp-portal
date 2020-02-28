import { watch } from 'hooks/useObservable';
import BigNumber from 'bignumber.js';

const initialState = {
  proxyAddress: undefined,
  annualDaiSavingsRate: BigNumber(0),
  daiSavingsRate: BigNumber(1),
  dateEarningsLastAccrued: Date.now(),
  daiLockedInDsr: BigNumber(0),
  fetchedSavings: false,
  savingsRateAccumulator: undefined,
  savingsDai: BigNumber(0)
};

function useSavings(address) {
  const savings = watch.savings(address);
  return savings === undefined
    ? initialState
    : {
        fetchedSavings: true,
        ...savings,
        daiLockedInDsr: savings?.daiLockedInDsr?.toBigNumber()
      };
}

export default useSavings;
