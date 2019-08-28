import useStore from 'hooks/useStore';
import useMaker from 'hooks/useMaker';

const useWalletBalances = () => {
  const [{ accounts }] = useStore();
  const { account } = useMaker();

  return account && accounts && accounts[account.address]
    ? accounts[account.address]
    : {};
};

export default useWalletBalances;
