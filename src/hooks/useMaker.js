import { useContext, useEffect, useState } from 'react';
import { checkEthereumProvider } from '../utils/ethereum';

import { MakerObjectContext } from '../providers/MakerHooksProvider';

function useMaker() {
  const {
    maker,
    account,
    transactions,
    newTxListener,
    resetTx,
    hideTx,
    selectors,
    network
  } = useContext(MakerObjectContext) || {};
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (maker) {
      maker.authenticate().then(() => {
        setAuthenticated(true);
      });

      return () => {
        setAuthenticated(false);
      };
    }
  }, [maker]);

  function isConnectedToProvider(provider) {
    return (
      maker.service('accounts').hasAccount() &&
      !!provider.address &&
      provider.address === maker.currentAddress()
    );
  }

  const _getMatchedAccount = address =>
    maker
      .listAccounts()
      .find(acc => acc.address.toUpperCase() === address.toUpperCase());

  const connectBrowserProvider = async () => {
    const networkId = maker.service('web3').networkId();

    const browserProvider = await checkEthereumProvider();

    if (browserProvider.networkId !== networkId)
      throw new Error(
        'browser ethereum provider and URL network param do not match.'
      );

    if (!browserProvider.address.match(/^0x[a-fA-F0-9]{40}$/))
      throw new Error(
        'browser ethereum provider providing incorrect or non-existent address'
      );

    let account;
    if (maker.service('accounts').hasAccount) {
      const matchedAccount = _getMatchedAccount(browserProvider.address);
      if (!matchedAccount) {
        account = await maker.addAccount({
          type: 'browser',
          autoSwitch: true
        });
      } else {
        account = matchedAccount;
      }
    } else {
      account = await maker.addAccount({
        type: 'browser',
        autoSwitch: true
      });
    }

    maker.useAccountWithAddress(account.address);
    const connectedAddress = maker.currentAddress();
    return connectedAddress;
  };

  return {
    maker,
    authenticated,
    isConnectedToProvider,
    connectBrowserProvider,
    account,
    transactions,
    newTxListener,
    resetTx,
    hideTx,
    selectors,
    network
  };
}

export default useMaker;
