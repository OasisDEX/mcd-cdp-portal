import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigation as useNavigationBase } from 'react-navi';
import { mixpanelIdentify } from '../utils/analytics';
import { instantiateMaker } from '../maker';
import PropTypes from 'prop-types';
import useStore from '../hooks/useStore';
import {
  checkEthereumProvider,
  browserEthereumProviderAddress
} from '../utils/ethereum';
import LoadingLayout from '../layouts/LoadingLayout';
import localSchemas from '../references/schemas/index.js';
import schemas from '@makerdao/dai-plugin-mcd/dist/schemas';
import useObservable, { watch } from 'hooks/useObservable';
import debug from 'debug';
const log = debug('maker:MakerProvider');

const { getVaults, getCdpIds } = localSchemas;
export const MakerObjectContext = createContext();

function useNavigation(network, mocks) {
  if (network === 'testnet' && mocks) return mocks.navigation;
  return useNavigationBase(); // eslint-disable-line react-hooks/rules-of-hooks
}

// FIXME the viewedAddress stuff should live elsewhere
function MakerProvider({
  children,
  network,
  testchainId,
  backendEnv,
  viewedAddress,
  mocks
}) {
  const [account, setAccount] = useState(null);
  const [txReferences, setTxReferences] = useState([]);
  const [txLastUpdate, setTxLastUpdate] = useState(0);
  const [maker, setMaker] = useState(null);
  const [watcher, setWatcher] = useState(null);
  const navigation = useNavigation(network, mocks);
  const [, dispatch] = useStore();

  const initAccount = account => {
    mixpanelIdentify(account.address, account.type);
    setAccount({ ...account });
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
      multicall.registerSchemas({ ...schemas, getVaults, getCdpIds });
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

      (async () => {
        const { address } = maker.currentAccount();
        log(`Found initial account: ${address}`);
        const proxy = await maker.service('proxy').getProxyAddress(address);
        if (proxy) log(`Found proxy address: ${proxy}`);
        else log('No proxy found');
        // updateWatcherWithAccount(maker, address, proxy);
      })();
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
          const id = tx?.metadata?.id;
          if (id) log(`Resetting event history cache for Vault #${id}`);
          else log('Resetting event history cache');
          maker.service('mcd:cdpManager').resetEventHistoryCache(id);
          maker.service('mcd:savings').resetEventHistoryCache();
        }
        log('Tx ' + state, tx.metadata);
        setTxLastUpdate(Date.now());
      });
    return () => {
      txManagerSub.unsub();
    };
  }, [maker, dispatch, connectBrowserProvider]);

  // useEffect(() => {
  //   if (maker && viewedAddress) {
  //     (async () => {
  //       if (
  //         viewedAddressData &&
  //         viewedAddress !== viewedAddressData.viewedAddress
  //       ) {
  //         setViewedAddressData(null);
  //       }
  //       const proxy = await maker
  //         .service('proxy')
  //         .getProxyAddress(viewedAddress);
  //       if (!proxy) {
  //         setViewedAddressData({
  //           cdps: [],
  //           viewedAddress
  //         });
  //         return;
  //       }

  //       const cdps = await maker.service('mcd:cdpManager').getCdpIds(proxy);
  //       const supportedCDPTypes = ilks.filter(ilk =>
  //         ilk.networks.includes(network)
  //       );

  //       const supportedCdps = cdps.filter(cdp => {
  //         return supportedCDPTypes.map(t => t.key).includes(cdp.ilk);
  //       }, []);

  //       supportedCdps.forEach(cdp => trackCdpById(maker, cdp.id, dispatch));
  //       setViewedAddressData({
  //         cdps: supportedCdps,
  //         viewedAddress
  //       });
  //     })();
  //   }
  // }, [maker, viewedAddress, dispatch, network]); // eslint-disable-line

  // const checkForNewCdps = async (numTries = 5, timeout = 500) => {
  //   const proxy = await maker.service('proxy').getProxyAddress(account.address);
  //   if (proxy) {
  //     maker.service('mcd:cdpManager').reset();

  //     const _checkForNewCdps = async triesRemaining => {
  //       const cdps = await maker.service('mcd:cdpManager').getCdpIds(proxy);
  //       if (isEqual(account.cdps, cdps)) {
  //         if (triesRemaining === 0) return;
  //         setTimeout(() => {
  //           _checkForNewCdps(triesRemaining - 1, timeout);
  //         }, timeout);
  //       } else {
  //         const newId = cdps
  //           .map(cdp => cdp.id)
  //           .filter(
  //             cdpId => account.cdps.map(cdp => cdp.id).indexOf(cdpId) < 0
  //           )[0];
  //         setAccount({ ...account, cdps: cdps });
  //         navigation.navigate(`/${Routes.BORROW}/${newId}?network=${network}`);
  //       }
  //     };

  //     _checkForNewCdps(numTries - 1);
  //   }
  // };

  const newTxListener = (transaction, txMessage) =>
    setTxReferences(current => [...current, [transaction, txMessage]]);

  const resetTx = () => setTxReferences([]);

  const selectors = {
    transactions: () =>
      txReferences
        .map(([promise, message]) => {
          const txManager = maker.service('transactionManager');
          try {
            return { tx: txManager.getTransaction(promise), message };
          } catch {
            return null;
          }
        })
        .filter(Boolean)
  };

  return (
    <MakerObjectContext.Provider
      value={{
        maker,
        watcher,
        account,
        network,
        txLastUpdate,
        resetTx,
        transactions: txReferences,
        newTxListener,
        /* checkForNewCdps, */
        selectors,
        connectBrowserProvider,
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
