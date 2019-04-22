import React, { createContext, useState } from 'react';
import { mixpanelIdentify } from 'utils/analytics';
import { instantiateMaker } from '../maker';
import { uniqueId } from '@makerdao/dai/src/utils'; // TODO - export from dai.js properly if final.
import store from 'store';
import useInterval from 'react-useinterval';

const ONE_MINUTE = 60 * 1000;

export const MakerObjectContext = createContext();

function MakerHooksProvider({ children, rpcUrl, addresses, network }) {
  const [account, setAccount] = useState(null);
  const [txReferences, setTxReferences] = useState([]);
  const [txLastUpdate, setTxLastUpdate] = useState(0);
  const [maker, setMaker] = useState(null);

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

  const newTxListener = (transaction, txMessage) => {
    setTxReferences(current => [
      ...current,
      [uniqueId(transaction), txMessage]
    ]);

    maker.service('transactionManager').listen(transaction, (tx, state) => {
      setTxLastUpdate(Date.now());
    });
  };

  const resetTx = () => setTxReferences([]);

  // This can be replaced with a SDK transaction manager event once its internal list of transactions changes.
  useInterval(() => {
    setTxLastUpdate(Date.now());
  }, ONE_MINUTE);

  const selectors = {
    transactions: () =>
      txReferences
        .map(([id, message]) => {
          const txManager = maker.service('transactionManager');
          try {
            // we should be using a public interface instead of txManager._tracker.
            return { tx: txManager._tracker.get(id), message, id };
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
