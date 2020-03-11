import { useContext } from 'react';

import { MakerObjectContext } from '../providers/MakerProvider';

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
    connectToProviderOfType,
    disconnect,
    navigation
  } = useContext(MakerObjectContext) || {};

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
