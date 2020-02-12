import BigNumber from 'bignumber.js';
import useMaker from 'hooks/useMaker';
import { tokensWithBalances } from 'reducers/accounts';
import { watch } from 'hooks/useObservable';

const useWalletBalances = () => {
  const { account } = useMaker();

  const balances = tokensWithBalances
    .filter(token => token !== 'DSR')
    .reduce((acc, token) => {
      const balance =
        watch.tokenBalance(account?.address, token)?.toBigNumber() ||
        BigNumber(0);
      acc[token] = balance;
      return acc;
    }, {});

  return balances;
};

export default useWalletBalances;
