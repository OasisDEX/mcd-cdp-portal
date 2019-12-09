import useStore from 'hooks/useStore';
import useMaker from 'hooks/useMaker';

const useWalletBalances = () => {
  const [{ accounts }] = useStore();
  const { account } = useMaker();

  const walletConnected = account && accounts && accounts[account.address];
  return walletConnected
    ? {
        ...accounts[account.address].balances,
        DSR: accounts[account.address].savings
      }
    : {};
};

export default useWalletBalances;
