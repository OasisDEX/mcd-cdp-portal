import React, { createContext } from 'react';
import { useEffect } from 'react';
import { watch } from 'hooks/useObservable';
import useMaker from 'hooks/useMaker';
import usePrevious from 'hooks/usePrevious';
import { Routes } from 'utils/constants';
import useCdpTypes from 'hooks/useCdpTypes';

export const VaultsContext = createContext({});

function VaultsProvider({ children, viewedAddress }) {
  const { account, navigation, network } = useMaker();
  const { cdpTypesList } = useCdpTypes();

  const rawUserVaultsList = watch.userVaultsList(account?.address);
  const rawViewedAddressVaultsList = watch.userVaultsList(viewedAddress);

  const userVaultsList = rawUserVaultsList
    ? rawUserVaultsList.filter(vault =>
        cdpTypesList.some(cdpType => cdpType === vault.vaultType)
      )
    : undefined;

  const viewedAddressVaultsList = rawViewedAddressVaultsList
    ? rawViewedAddressVaultsList.filter(vault =>
        cdpTypesList.some(cdpType => cdpType === vault.vaultType)
      )
    : undefined;

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
  const viewedAddressVaultsData = watch.userVaultsData(
    viewedAddressVaultIds ? viewedAddressVaultIds : undefined
  );

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

  return (
    <VaultsContext.Provider
      value={{
        userVaults: userVaultsList
          ? userVaultIds && userVaultsData
            ? userVaultsData
            : []
          : undefined,
        viewedAddressVaults: viewedAddressVaultsList
          ? viewedAddressVaultIds && viewedAddressVaultsData
            ? viewedAddressVaultsData
            : []
          : undefined
      }}
    >
      {children}
    </VaultsContext.Provider>
  );
}

export default VaultsProvider;
