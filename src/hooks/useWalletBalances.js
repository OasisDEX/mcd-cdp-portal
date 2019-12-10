import { useMemo } from 'react';

import useStore from 'hooks/useStore';
import useMaker from 'hooks/useMaker';
import { getSavingsBalance } from 'reducers/accounts';

const useWalletBalances = () => {
  const [{ accounts, savings }] = useStore();
  const { account } = useMaker();

  const dsrBalance = useMemo(() => {
    return account
      ? getSavingsBalance(account.address, { accounts, savings })
      : 0;
  }, [account, accounts, savings]);

  const walletConnected = account && accounts && accounts[account.address];
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
