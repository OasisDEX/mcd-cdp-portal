import { useMemo } from 'react';
import useStore from 'hooks/useStore';
import useMaker from 'hooks/useMaker';
import { getSavingsBalance } from 'reducers/accounts';
import BigNumber from 'bignumber.js';

const useWalletBalances = () => {
  const [{ accounts, savings }] = useStore();
  const { account } = useMaker();

  const walletConnected =
    account && accounts && savings && accounts[account.address];

  const dsrBalance = useMemo(() => {
    return walletConnected
      ? getSavingsBalance(account.address, { accounts, savings })
      : new BigNumber(0);
  }, [account, accounts, savings, walletConnected]);

  return walletConnected
    ? {
        ...accounts[account.address].balances,
        DSR: dsrBalance
      }
    : {
        DSR: dsrBalance
      };
};

export default useWalletBalances;
