import React, { createContext, useState, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import { useNavigation } from 'react-navi';
import { mixpanelIdentify } from '../utils/analytics';
import { instantiateMaker } from '../maker';

export const MakerObjectContext = createContext();

function MakerHooksProvider({
  children,
  rpcUrl,
  network,
  testchainId,
  backendEnv
}) {
  const [account, setAccount] = useState(null);
  const [txReferences, setTxReferences] = useState([]);
  const [txLastUpdate, setTxLastUpdate] = useState(0);
  const [maker, setMaker] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (!rpcUrl) return;
    instantiateMaker({
      network,
      rpcUrl,
      testchainId,
      backendEnv
    }).then(maker => {
      setMaker(maker);

      maker.on('accounts/CHANGE', eventObj => {
        const { account } = eventObj.payload;
        mixpanelIdentify(account.address, 'metamask');
        setAccount({ ...account, cdps: [] });
        (async () => {
          const proxy = await maker
            .service('proxy')
            .getProxyAddress(account.address);
          if (proxy) {
            const cdpIds = await maker
              .service('mcd:cdpManager')
              .getCdpIds(proxy);
            setAccount({ ...account, cdps: cdpIds });
          }
        })();
      });
    });
  }, [rpcUrl]);

  const checkForNewCdps = async (numTries = 3, timeout = 500) => {
    const proxy = await maker.service('proxy').getProxyAddress(account.address);
    if (proxy) {
      // FIXME: clear the cached ids
      maker.service('mcd:cdpManager')._getCdpIdsPromises[proxy] = null;

      const _checkForNewCdps = async triesRemaining => {
        const cdps = await maker.service('mcd:cdpManager').getCdpIds(proxy);
        if (isEqual(account.cdps, cdps) && triesRemaining > 0) {
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
          navigation.navigate(`/${newId}?network=${network}`);
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

export default MakerHooksProvider;
