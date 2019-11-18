import React, { createContext, useState, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import { useNavigation } from 'react-navi';
import { mixpanelIdentify } from '../utils/analytics';
import { instantiateMaker } from '../maker';
import Waiting from 'pages/Waiting';
import PropTypes from 'prop-types';
import { Routes } from 'utils/constants';
import useStore from '../hooks/useStore';
import ilks from 'references/ilkList';
import { trackCdpById } from 'reducers/multicall/cdps';
import {
  createWatcher,
  startWatcher,
  updateWatcherWithAccount
} from '../watch';
import { batchActions } from '../utils/redux';
import LoadingLayout from '../layouts/LoadingLayout';
import debug from 'debug';
const log = debug('maker:MakerProvider');

export const MakerObjectContext = createContext();

function MakerProvider({
  children,
  network,
  testchainId,
  backendEnv,
  viewedAddress
}) {
  const [account, setAccount] = useState(null);
  const [viewedAddressData, setViewedAddressData] = useState(null);
  const [txReferences, setTxReferences] = useState([]);
  const [txLastUpdate, setTxLastUpdate] = useState(0);
  const [maker, setMaker] = useState(null);
  const navigation = useNavigation();
  const [, dispatch] = useStore();
  const [displayApp, setDisplayApp] = useState(false);

  const initAccount = account => {
    mixpanelIdentify(account.address, account.type);
    setAccount({ ...account, cdps: [] });
  };

  useEffect(() => {
    (async () => {
      const newMaker = await instantiateMaker({
        network,
        testchainId,
        backendEnv,
        navigation
      });
      if (newMaker.service('accounts').hasAccount()) {
        initAccount(newMaker.currentAccount());
      }
      setMaker(newMaker);

      newMaker.on('accounts/CHANGE', eventObj => {
        const { account } = eventObj.payload;
        initAccount(account);
        (async () => {
          const proxy = await newMaker
            .service('proxy')
            .getProxyAddress(account.address);
          if (proxy) {
            log(`Found proxy address: ${proxy}`);
            const cdpIds = await newMaker
              .service('mcd:cdpManager')
              .getCdpIds(proxy);
            setAccount({ ...account, cdps: cdpIds });
          } else {
            log('No proxy found');
          }
          updateWatcherWithAccount(newMaker, account.address, proxy);
        })();
      });
    })();
    // leaving maker out of the deps because it would create an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendEnv, dispatch, network, testchainId]);

  useEffect(() => {
    if (maker) {
      const watcher = createWatcher(maker);
      const batchSub = watcher.batch().subscribe(updates => {
        dispatch(batchActions(updates));
        // make entire list of updates available in a single reducer call
        dispatch({ type: 'watcherUpdates', payload: updates });
      });
      const onNewBlockSub = watcher.onNewBlock(blockHeight =>
        log(`Latest block height: ${blockHeight}`)
      );
      const txManagerSub = maker
        .service('transactionManager')
        .onTransactionUpdate((tx, state, err) => {
          if (state === 'mined')
            maker.service('mcd:cdpManager').resetEventHistoryCache();
          log('Tx ' + state, tx.metadata);
          setTxLastUpdate(Date.now());
        });
      dispatch({ type: 'CLEAR_CONTRACT_STATE' });
      startWatcher(maker);
      return () => {
        batchSub.unsub();
        onNewBlockSub.unsub();
        txManagerSub.unsub();
      };
    }
  }, [maker, dispatch]);

  useEffect(() => {
    if (maker && viewedAddress) {
      (async () => {
        if (
          viewedAddressData &&
          viewedAddress !== viewedAddressData.viewedAddress
        ) {
          setViewedAddressData(null);
        }
        const proxy = await maker
          .service('proxy')
          .getProxyAddress(viewedAddress);
        if (!proxy) {
          setViewedAddressData({
            cdps: [],
            viewedAddress
          });
          return;
        }

        const cdps = await maker.service('mcd:cdpManager').getCdpIds(proxy);
        const supportedCDPTypes = ilks.filter(ilk =>
          ilk.networks.includes(network)
        );

        const supportedCdps = cdps.filter(cdp => {
          return supportedCDPTypes.map(t => t.key).includes(cdp.ilk);
        }, []);

        supportedCdps.forEach(cdp => trackCdpById(maker, cdp.id, dispatch));
        setViewedAddressData({
          cdps: supportedCdps,
          viewedAddress
        });
      })();
    }
  }, [maker, viewedAddress, dispatch, network]); // eslint-disable-line

  const checkForNewCdps = async (numTries = 5, timeout = 500) => {
    const proxy = await maker.service('proxy').getProxyAddress(account.address);
    if (proxy) {
      maker.service('mcd:cdpManager').reset();

      const _checkForNewCdps = async triesRemaining => {
        const cdps = await maker.service('mcd:cdpManager').getCdpIds(proxy);
        if (isEqual(account.cdps, cdps)) {
          if (triesRemaining === 0) return;
          setTimeout(() => {
            _checkForNewCdps(triesRemaining - 1, timeout);
          }, timeout);
        } else {
          const newId = cdps
            .map(cdp => cdp.id)
            .filter(
              cdpId => account.cdps.map(cdp => cdp.id).indexOf(cdpId) < 0
            )[0];
          setAccount({ ...account, cdps: cdps });
          navigation.navigate(`/${Routes.BORROW}/${newId}?network=${network}`);
        }
      };

      _checkForNewCdps(numTries - 1);
    }
  };

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

  const { url } = navigation.getCurrentValue();
  const isLanding = url.pathname === '/';

  useEffect(() => {
    (async () => {
      const testing = process.env.NODE_ENV === 'test';
      const KEY = 'mcd';
      const systemDebtCeiling =
        maker &&
        (await maker.service('mcd:systemData').getSystemWideDebtCeiling());
      if (
        isLanding ||
        testing ||
        systemDebtCeiling > 0 ||
        window.localStorage.password === KEY
      ) {
        setDisplayApp(true);
      } else {
        setDisplayApp(false);
      }
    })();
  }, [maker, isLanding]);

  return (
    <MakerObjectContext.Provider
      value={{
        maker,
        account,
        network,
        txLastUpdate,
        resetTx,
        transactions: txReferences,
        newTxListener,
        checkForNewCdps,
        selectors,
        viewedAddressData
      }}
    >
      {maker ? (
        displayApp ? (
          children
        ) : (
          <Waiting />
        )
      ) : (
        <LoadingLayout text="Loading..." />
      )}
    </MakerObjectContext.Provider>
  );
}

MakerProvider.propTypes = {
  network: PropTypes.string.isRequired
};

export default MakerProvider;
