import { useContext, useState } from 'react';

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
    txLastUpdate,
    connectBrowserProvider,
    navigation
  } = useContext(MakerObjectContext) || {};

  const [walletSubprovider, setWalletSubrovider] = useState(null);

  const connectToProviderOfType = async type => {
    const account = await maker.addAccount({
      type
    });
    maker.useAccountWithAddress(account.address);
    const connectedAddress = maker.currentAddress();
    const walletSubprovider = maker.service('accounts').currentWallet();
    setWalletSubrovider(walletSubprovider);
    return connectedAddress;
  };

  return {
    maker,
    watcher,
    authenticated: true,
    connectBrowserProvider,
    connectToProviderOfType,
    account,
    viewedAddress,
    transactions,
    newTxListener,
    resetTx,
    hideTx,
    selectors,
    network,
    txLastUpdate,
    navigation,
    walletSubprovider
  };
}

export default useMaker;
