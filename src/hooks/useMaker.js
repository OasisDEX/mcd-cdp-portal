import { useContext, useEffect, useState } from 'react';
import { checkEthereumProvider } from 'utils/ethereum';

import { MakerObjectContext } from 'providers/MakerHooksProvider';

function useMaker() {
  const { maker, account } = useContext(MakerObjectContext);
  const [authenticated, setAuthenticated] = useState(false);

  async function authenticatedMaker() {
    await maker.authenticate();
    return maker;
  }

  useEffect(() => {
    maker.authenticate().then(() => {
      setAuthenticated(true);
    });

    return () => {
      setAuthenticated(false);
    };
  }, [maker]);

  function isConnectedToProvider(provider) {
    return (
      maker.service('accounts').hasAccount() &&
      !!provider.address &&
      provider.address === maker.currentAddress()
    );
  }

  const networkId = maker.service('web3').networkId();

  const connectMetamask = async () => {
    try {
      const browserProvider = await checkEthereumProvider();

      if (browserProvider.networkId !== networkId)
        throw new Error(
          'browser ethereum provider and URL network param do not match.'
        );

      if (!isConnectedToProvider(browserProvider))
        await maker.addAccount({
          type: 'browser'
        });

      const connectedAddress = maker.currentAddress();

      return connectedAddress;
    } catch (err) {
      window.alert(err.toString());
    }
  };

  return {
    maker,
    authenticated,
    authenticatedMaker,
    isConnectedToProvider,
    networkId,
    connectMetamask,
    account
  };
}

export default useMaker;
