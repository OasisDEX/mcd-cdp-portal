import { useContext } from 'react';

import { MakerObjectContext } from '../providers/MakerProvider';
import { AccountTypes } from '../utils/constants';

function useMaker() {
  const {
    maker,
    watcher,
    account,
    viewedAddress,
    transactions,
    setTransactions,
    txDrawExpanded,
    setTxDrawExpanded,
    hideTx,
    selectors,
    network,
    txLastUpdate,
    connectBrowserProvider,
    navigation
  } = useContext(MakerObjectContext) || {};

  const disconnectWalletLink = subprovider => subprovider.close();
  const disconnectWalletConnect = async subprovider =>
    (await subprovider.getWalletConnector()).killSession();
  const disconnectBrowserWallet = () =>
    ['lastConnectedWalletType', 'lastConnectedWalletAddress'].forEach(x =>
      sessionStorage.removeItem(x)
    );

  const disconnect = () => {
    const subprovider = maker.service('accounts').currentWallet();
    if (subprovider.isWalletLink) return disconnectWalletLink(subprovider);
    else if (subprovider.isWalletConnect) disconnectWalletConnect(subprovider);
    else if (
      sessionStorage.getItem('lastConnectedWalletType') ===
      AccountTypes.METAMASK
    )
      disconnectBrowserWallet();
    document.location.reload();
  };

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
    connectBrowserProvider,
    connectToProviderOfType,
    account,
    viewedAddress,
    transactions,
    setTransactions,
    txDrawExpanded,
    setTxDrawExpanded,
    hideTx,
    selectors,
    network,
    txLastUpdate,
    navigation,
    disconnect
  };
}

export default useMaker;
