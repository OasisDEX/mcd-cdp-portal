import { useContext } from 'react';
import { VaultsContext } from '../providers/VaultsProvider';

function useVaults() {
  const { userVaults, viewedAddressVaults } = useContext(VaultsContext);
  return {
    userVaults,
    viewedAddressVaults
  };
}

export default useVaults;
