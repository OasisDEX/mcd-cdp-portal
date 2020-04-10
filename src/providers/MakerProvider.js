import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigation as useNavigationBase } from 'react-navi';
import { mixpanelIdentify } from '../utils/analytics';
import { AccountTypes } from '../utils/constants';
import { instantiateMaker } from '../maker';
import PropTypes from 'prop-types';
import {
  checkEthereumProvider,
  browserEthereumProviderAddress
} from '../utils/ethereum';
import LoadingLayout from '../layouts/LoadingLayout';
import schemas from '@makerdao/dai-plugin-mcd/dist/schemas';
import useObservable, { watch } from 'hooks/useObservable';
import useAnalytics from 'hooks/useAnalytics';
import debug from 'debug';
const log = debug('maker:MakerProvider');

export const MakerObjectContext = createContext();

function useNavigation(network, mocks) {
  if (network === 'testnet' && mocks) return mocks.navigation;
  return useNavigationBase(); // eslint-disable-line react-hooks/rules-of-hooks
}

function MakerProvider({
  children,
  network,
  testchainId,
  backendEnv,
  viewedAddress,
  mocks
}) {
  const [account, setAccount] = useState(null);
  const [txLastUpdate, setTxLastUpdate] = useState({});
  const [maker, setMaker] = useState(null);
  const [watcher, setWatcher] = useState(null);

  const navNetwork = network === 'kovan-osm' ? 'kovan' : network;
  const navigation = useNavigation(navNetwork, mocks);

  const { trackBtnClick } = useAnalytics();
  const initAccount = account => {
    mixpanelIdentify(account.address, account.type);
    setAccount({ ...account });
  };

  const removeAccounts = () => {
    maker.service('accounts')._accounts = {};
    maker.service('accounts')._currentAccount = '';
    setAccount(null);
  };

  const connectBrowserProvider = useCallback(async () => {
    const networkId = maker.service('web3').networkId();
    const browserProvider = await checkEthereumProvider();

    function getMatchedAccount(address) {
      return maker
        .listAccounts()
        .find(acc => acc.address.toUpperCase() === address.toUpperCase());
    }

    if (browserProvider.networkId !== networkId)
      throw new Error(
        'browser ethereum provider and URL network param do not match.'
      );
    if (
      !browserProvider.address ||
      !browserProvider.address.match(/^0x[a-fA-F0-9]{40}$/)
    )
      throw new Error(
        'browser ethereum provider providing incorrect or non-existent address'
      );

    let existingAccount;
    if (maker.service('accounts').hasAccount()) {
      existingAccount = getMatchedAccount(browserProvider.address);
      if (existingAccount) {
        log(`Using existing SDK account: ${existingAccount.address}`);
        maker.useAccountWithAddress(existingAccount.address);
      }
    }
    if (!existingAccount) {
      log('Adding new browser account to SDK');
      await maker.addAccount({
        type: 'browser',
        autoSwitch: true
      });
    }

    const connectedAddress = maker.currentAddress();
    return connectedAddress;
  }, [maker]);

  useEffect(() => {
    (async () => {
      const newMaker = await instantiateMaker({
        network,
        testchainId,
        backendEnv,
        navigation
      });

      // Register multicall schemas and map useObservable hook to watch convenience helper
      const multicall = newMaker.service('multicall');
      multicall.registerSchemas({ ...schemas });
      multicall.observableKeys.forEach(
        key => (watch[key] = (...args) => useObservable(key, ...args)) // eslint-disable-line react-hooks/rules-of-hooks
      );
      // Create and start multicall watcher
      const watcher = multicall.createWatcher({ interval: 'block' });
      multicall.start();
      setWatcher(watcher);
      setMaker(newMaker);

      log('Initialized maker instance');
    })();
    // leaving maker out of the deps because it would create an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendEnv, network, testchainId]);

  useEffect(() => {
    if (!maker) return;
    if (maker.service('accounts').hasAccount()) {
      initAccount(maker.currentAccount());
    } else {
      // Reconnect browser provider if active address matches last connected
      const lastType = sessionStorage.getItem('lastConnectedWalletType');
      if (lastType === 'browser') {
        const lastAddress = sessionStorage.getItem(
          'lastConnectedWalletAddress'
        );
        browserEthereumProviderAddress().then(activeAddress => {
          if (activeAddress === lastAddress) {
            log(
              `Reconnecting address: ${activeAddress} (matches last connected wallet address)`
            );
            connectBrowserProvider();
          }
        });
      }
    }

    maker.on('accounts/CHANGE', eventObj => {
      const { account } = eventObj.payload;
      if (eventObj.sequence === 1)
        trackBtnClick(undefined, { fathom: { id: 'connectWallet' } });
      sessionStorage.setItem('lastConnectedWalletType', account.type);
      sessionStorage.setItem(
        'lastConnectedWalletAddress',
        account.address.toLowerCase()
      );
      log(`Account changed to: ${account.address}`);
      initAccount(account);
    });

    const txManagerSub = maker
      .service('transactionManager')
      .onTransactionUpdate((tx, state) => {
        if (state === 'mined') {
          const id = tx.metadata?.id;
          if (id) {
            log(`Resetting event history cache for Vault #${id}`);
            maker.service('mcd:cdpManager').resetEventHistoryCache(id);
            setTxLastUpdate(current => ({ ...current, [id]: Date.now() }));
          } else if (tx.metadata?.contract === 'PROXY_ACTIONS_DSR') {
            log('Resetting savings event history cache');
            maker.service('mcd:savings').resetEventHistoryCache();
            setTxLastUpdate(current => ({ ...current, save: Date.now() }));
          }
        }
        log('Tx ' + state, tx.metadata);
      });
    return () => {
      txManagerSub.unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maker, connectBrowserProvider]);

  const connectToProviderOfType = async type => {
    if (!maker) return;
    if (maker.service('accounts').hasAccount()) {
      initAccount(maker.currentAccount());
    } else {
      const account = await maker.addAccount({
        type
      });
      maker.useAccountWithAddress(account.address);
    }
    const connectedAddress = maker.currentAddress();
    return connectedAddress;
  };

  const disconnectWalletLink = subprovider => subprovider.resetWallet();
  const disconnectWalletConnect = async subprovider =>
    (await subprovider.getWalletConnector()).killSession();
  const disconnectBrowserWallet = () =>
    ['lastConnectedWalletType', 'lastConnectedWalletAddress'].forEach(x =>
      sessionStorage.removeItem(x)
    );

  const disconnect = () => {
    const subprovider = maker.service('accounts').currentWallet();
    if (subprovider.isWalletLink) disconnectWalletLink(subprovider);
    else if (subprovider.isWalletConnect) disconnectWalletConnect(subprovider);
    else if (
      sessionStorage.getItem('lastConnectedWalletType') ===
      AccountTypes.METAMASK
    )
      disconnectBrowserWallet();
    removeAccounts();
  };

  return (
    <MakerObjectContext.Provider
      value={{
        maker,
        watcher,
        account,
        network,
        txLastUpdate,
        connectBrowserProvider,
        connectToProviderOfType,
        disconnect,
        viewedAddress,
        navigation
      }}
    >
      {maker ? children : <LoadingLayout />}
    </MakerObjectContext.Provider>
  );
}

MakerProvider.propTypes = {
  network: PropTypes.string.isRequired
};

export default MakerProvider;
