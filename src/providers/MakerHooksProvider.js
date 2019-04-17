import React, { createContext, useState, useRef } from 'react';
import { mixpanelIdentify } from 'utils/analytics';
import { instantiateMaker } from '../maker';
import store from 'store';

export const MakerObjectContext = createContext();

function MakerHooksProvider({ children, rpcUrl, addresses, network }) {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [maker, setMaker] = useState(null);
  const id = useRef(0);

  React.useEffect(() => {
    if (!rpcUrl) return;
    instantiateMaker({ network, rpcUrl, addresses }).then(maker => {
      setMaker(maker);

      maker.on('accounts/CHANGE', eventObj => {
        const { account } = eventObj.payload;
        mixpanelIdentify(account, 'metamask');
        setAccount(account);
      });

      store.dispatch({ type: 'addresses/set', payload: { addresses } });
    });
  }, [rpcUrl, addresses]);

  const newTxListener = transaction => txMessage => {
    if (!maker)
      throw new Error(
        'Cannot send a transaction before maker has been initialized'
      );

    const txId = id.current++;

    transaction.catch(() =>
      setTransactions(txs =>
        txs.map(tx => (tx.id === txId ? { ...tx, state: 'error' } : tx))
      )
    );

    setTransactions(txs => [
      ...txs,
      {
        state: 'initialized',
        id: txId,
        message: txMessage,
        hash: '',
        hidden: false
      }
    ]);

    maker.service('transactionManager').listen(transaction, {
      pending({ hash }) {
        setTransactions(txs =>
          txs.map(tx =>
            tx.id === txId ? { ...tx, hash, state: 'pending' } : tx
          )
        );
      },
      mined() {
        setTransactions(txs =>
          txs.map(tx => (tx.id === txId ? { ...tx, state: 'mined' } : tx))
        );
      },
      error() {
        setTransactions(txs =>
          txs.map(tx => (tx.id === txId ? { ...tx, state: 'error' } : tx))
        );
      }
    });
  };

  const hideTx = txId => {
    setTransactions(txs =>
      txs.map(tx => (tx.id === txId ? { ...tx, hidden: true } : tx))
    );
  };

  const getVisibleTransactions = () => transactions.filter(tx => !tx.hidden);

  const selectors = {
    getVisibleTransactions
  };

  return (
    <MakerObjectContext.Provider
      value={{
        maker,
        account,
        network,
        transactions,
        newTxListener,
        hideTx,
        selectors
      }}
    >
      {children}
    </MakerObjectContext.Provider>
  );
}

export default MakerHooksProvider;
