import { useMemo, useState } from 'react';
import useStore from 'hooks/useStore';
import useMaker from 'hooks/useMaker';
import useInterval from 'hooks/useInterval';
import { getSavingsBalance } from 'reducers/accounts';
import BigNumber from 'bignumber.js';

const useWalletBalances = () => {
  const [{ accounts, savings }] = useStore();
  const { account } = useMaker();
  const [inferredDSRBalance, setInferredDSRBalance] = useState(
    new BigNumber(0)
  );

  const walletConnected =
    account && accounts && savings && accounts[account.address];

  const dsrBalance = useMemo(() => {
    return walletConnected
      ? getSavingsBalance(account.address, { accounts, savings })
      : 0;
  }, [account, accounts, savings, walletConnected]);

  useInterval(
    () => {
      const { rho, dsr } = savings;
      const now = new BigNumber(Date.now());
      const secondsSinceLastDrip = now
        .div(1000)
        .integerValue()
        .minus(rho);
      setInferredDSRBalance(dsr.pow(secondsSinceLastDrip).times(dsrBalance));
    },
    walletConnected ? 1000 : null
  );

  return walletConnected
    ? {
        ...accounts[account.address].balances,
        DSR: dsrBalance,
        estimatedDSR: inferredDSRBalance
      }
    : {
        DSR: dsrBalance,
        estimatedDSR: new BigNumber(0)
      };
};

export default useWalletBalances;
