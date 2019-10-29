import React, { createContext, useState, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import { useNavigation } from 'react-navi';
import { mixpanelIdentify } from '../utils/analytics';
import { instantiateMaker } from '../maker';
import PropTypes from 'prop-types';
import { Routes } from 'utils/constants';
import useStore from '../hooks/useStore';
import { createWatcher, startWatcher } from '../watch';
import { batchActions } from '../utils/redux';

export const MakerObjectContext = createContext();

function MakerProvider({ children, network, testchainId, backendEnv }) {
  const [account, setAccount] = useState(null);
  const [txReferences, setTxReferences] = useState([]);
  const [txLastUpdate, setTxLastUpdate] = useState(0);
  const [maker, setMaker] = useState(null);
  const navigation = useNavigation();
  const [, dispatch] = useStore();

  const initAccount = account => {
    mixpanelIdentify(account.address, account.type);
    setAccount({ ...account, cdps: [] });
  };

  useEffect(() => {
    (async () => {
      const maker = await instantiateMaker({
        network,
        testchainId,
        backendEnv
      });
      if (maker.service('accounts').hasAccount()) {
        initAccount(maker.currentAccount());
      }
      setMaker(maker);

      maker.on('accounts/CHANGE', eventObj => {
        const { account } = eventObj.payload;
        initAccount(account);
        (async () => {
          const proxy = await maker
            .service('proxy')
            .getProxyAddress(account.address);
          if (proxy) {
            console.debug(`Found proxy address: ${proxy}`);
            const cdpIds = await maker
              .service('mcd:cdpManager')
              .getCdpIds(proxy);
            setAccount({ ...account, cdps: cdpIds });
          } else {
            console.debug(`No proxy found`);
          }
        })();
      });
    })();
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
        console.debug(`Latest block height: ${blockHeight}`)
      );
      dispatch({ type: 'CLEAR_CONTRACT_STATE' });
      startWatcher(maker);
      return () => {
        batchSub.unsub();
        onNewBlockSub.unsub();
      };
    }
  }, [maker, dispatch, account]);

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

  const newTxListener = (transaction, txMessage) => {
    setTxReferences(current => [...current, [transaction, txMessage]]);

    maker.service('transactionManager').listen(transaction, (tx, state) => {
      setTxLastUpdate(Date.now());
    });
  };

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
        account,
        network,
        txLastUpdate,
        resetTx,
        transactions: txReferences,
        newTxListener,
        checkForNewCdps,
        selectors
      }}
    >
      {children}
    </MakerObjectContext.Provider>
  );
}

MakerProvider.propTypes = {
  network: PropTypes.string.isRequired
};

export default MakerProvider;
