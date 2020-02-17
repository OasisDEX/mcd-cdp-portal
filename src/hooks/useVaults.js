import { useEffect } from 'react';
import { watch } from 'hooks/useObservable';
import useMaker from 'hooks/useMaker';
import usePrevious from 'hooks/usePrevious';
import { Routes } from 'utils/constants';

function useVaults() {
  const { account, viewedAddress, navigation, network } = useMaker();

  const userVaultsList = watch.userVaultsList(account?.address);
  const viewedAddressVaultsList = watch.userVaultsList(viewedAddress);

  const userVaultIds = userVaultsList
    ? userVaultsList.map(({ vaultId }) => vaultId)
    : [];

  const prevUserVaultsList = usePrevious(userVaultsList);
  const prevUserVaultIds = usePrevious(userVaultIds);

  const viewedAddressVaultIds =
    viewedAddressVaultsList !== undefined && viewedAddressVaultsList.length
      ? viewedAddressVaultsList.map(({ vaultId }) => vaultId)
      : undefined;

  const userVaultsData = watch.userVaultsData(
    userVaultIds.length ? userVaultIds : undefined
  );
  const viewedAddressVaultsData = watch.userVaultsData(viewedAddressVaultIds);

  const newVaultCreated =
    prevUserVaultsList !== undefined &&
    userVaultsList !== undefined &&
    prevUserVaultIds.length + 1 === userVaultIds.length;

  useEffect(() => {
    if (newVaultCreated) {
      const newVaultId = userVaultIds[0];
      navigation.navigate(`/${Routes.BORROW}/${newVaultId}?network=${network}`);
    }
  }, [newVaultCreated, navigation, network, userVaultIds]);

  return {
    userVaults: userVaultsList
      ? userVaultIds && userVaultsData
        ? userVaultsData
        : []
      : undefined,
    viewedAddressVaults: viewedAddressVaultsList
      ? viewedAddressVaultIds && userVaultsData
        ? viewedAddressVaultsData
        : []
      : undefined
  };
}

export default useVaults;
