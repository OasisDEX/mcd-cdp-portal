import useMaker from 'hooks/useMaker';
import { showWalletTokens } from 'references/config';
import { watch } from 'hooks/useObservable';

const useWalletBalances = () => {
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
    ) || {}
  );
};

export default useWalletBalances;
