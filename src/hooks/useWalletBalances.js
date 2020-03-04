import useMaker from 'hooks/useMaker';
import { showWalletTokens } from 'references/config';
import { watch } from 'hooks/useObservable';
import BigNumber from 'bignumber.js';

const useWalletBalances = () => {
  const defaultValues = showWalletTokens.reduce((acc, token) => {
    acc[token] = BigNumber(0);
    return acc;
  }, {});

  const { account } = useMaker();
  const symbols = showWalletTokens.filter(v => v !== 'DSR');
  const dsrBalance = watch.daiLockedInDsr(account?.address);
  const tokenBalances = watch.tokenBalances(account?.address, symbols);
  return (
    tokenBalances?.reduce(
      (acc, tokenBalance) => {
        acc[tokenBalance.symbol] = tokenBalance.toBigNumber();
        return acc;
      },
      { DSR: dsrBalance?.toBigNumber() }
    ) || defaultValues
  );
};

export default useWalletBalances;
