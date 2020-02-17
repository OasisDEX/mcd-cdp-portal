import { useContext } from 'react';

import { MakerObjectContext } from '../providers/MakerProvider';

function useMaker() {
  const {
    maker,
    watcher,
    account,
    viewedAddress,
    transactions,
    newTxListener,
    resetTx,
    hideTx,
    selectors,
    network,
    checkForNewCdps,
    txLastUpdate,
    connectBrowserProvider,
    navigation
  } = useContext(MakerObjectContext) || {};

  function isConnectedToProvider(provider) {
    return (
      maker.service('accounts').hasAccount() &&
      !!provider.address &&
      provider.address === maker.currentAddress()
    );
  }

  const connectToProviderOfType = async type => {
    const account = await maker.addAccount({
      type
    });
    maker.useAccountWithAddress(account.address);
    const connectedAddress = maker.currentAddress();
    return connectedAddress;
  };

  return {
    maker,
    watcher,
    authenticated: true,
    isConnectedToProvider,
    connectBrowserProvider,
    connectToProviderOfType,
    checkForNewCdps,
    account,
    viewedAddress,
    transactions,
    newTxListener,
    resetTx,
    hideTx,
    selectors,
    network,
    txLastUpdate,
    navigation
  };
}

export default useMaker;
