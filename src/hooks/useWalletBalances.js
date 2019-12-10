import useStore from 'hooks/useStore';
import useMaker from 'hooks/useMaker';
import { getSavingsBalance } from 'reducers/accounts';

const useWalletBalances = () => {
  const [{ accounts, savings }] = useStore();
  const { account } = useMaker();

  const walletConnected = account && accounts && accounts[account.address];
  return walletConnected
    ? {
        ...accounts[account.address].balances,
        DSR: getSavingsBalance(account.address, { accounts, savings })
      }
    : {};
};

export default useWalletBalances;
