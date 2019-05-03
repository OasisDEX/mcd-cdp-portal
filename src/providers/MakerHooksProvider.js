import React, { createContext, useState, useEffect } from 'react';
import { mixpanelIdentify } from 'utils/analytics';
import { instantiateMaker } from '../maker';

export const MakerObjectContext = createContext();

function MakerHooksProvider({ children, rpcUrl, addresses, network }) {
  const [account, setAccount] = useState(null);
  const [txReferences, setTxReferences] = useState([]);
  const [txLastUpdate, setTxLastUpdate] = useState(0);
  const [maker, setMaker] = useState(null);

  useEffect(() => {
    if (!rpcUrl) return;
    instantiateMaker({ network, rpcUrl, addresses }).then(maker => {
      setMaker(maker);

      maker.on('accounts/CHANGE', eventObj => {
        const { account } = eventObj.payload;
        mixpanelIdentify(account, 'metamask');
        setAccount(account);
      });
    });
  }, [rpcUrl, addresses]);

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
        selectors
      }}
    >
      {children}
    </MakerObjectContext.Provider>
  );
}

export default MakerHooksProvider;
