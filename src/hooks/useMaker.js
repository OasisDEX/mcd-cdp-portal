import { useContext, useEffect, useState } from 'react';
import { checkEthereumProvider } from 'utils/ethereum';

import { MakerObjectContext } from 'providers/MakerHooksProvider';

function useMaker() {
  const { maker, account } = useContext(MakerObjectContext);
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

  const connectMetamask = async () => {
    try {
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

      let metaMaskAccount;
      if (!maker.service('accounts').hasAccount) {
        metaMaskAccount = await maker.addAccount({
          type: 'browser'
        });
      } else {
        const matchedAccount = maker
          .listAccounts()
          .find(
            acc =>
              acc.address.toUpperCase() ===
              browserProvider.address.toUpperCase()
          );
        if (!matchedAccount) {
          metaMaskAccount = await maker.addAccount({
            type: 'browser'
          });
        } else {
          metaMaskAccount = matchedAccount;
        }
      }

      maker.useAccountWithAddress(metaMaskAccount.address);
      const connectedAddress = maker.currentAddress();
      return connectedAddress;
    } catch (err) {
      window.alert(err.toString());
    }
  };

  return {
    maker,
    authenticated,
    isConnectedToProvider,
    connectMetamask,
    account
  };
}

export default useMaker;
