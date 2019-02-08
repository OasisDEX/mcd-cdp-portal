import { useState } from 'react';

import maker from 'maker';
import watcher from 'watcher';
import { reInstantiateMaker } from '../../maker';

const DEFAULT_NETWORK_INFO = {
  rpcURL: '',
  addresses: {}
};

function eq(a, b) {
  return a === b;
}

function useNetwork() {
  const [currentNetworkInfo, setcurrentNetworkInfo] = useState(
    DEFAULT_NETWORK_INFO
  );

  async function switchNetwork({ rpcURL, addresses }) {
    const newNode = rpcURL !== currentNetworkInfo.rpcURL;
    const newAddresses = eq(addresses, currentNetworkInfo.addresses);
    // noop if nothing has changed
    if (!newNode && !newAddresses) return;

    if (!isSupportedNetwork(rpcURL))
      throw new Error(`${rpcURL} is not a supported node provider`);

    reInstantiateMaker({ rpcURL });
  }

  return { switchNetwork };
}

export default useToggle;
