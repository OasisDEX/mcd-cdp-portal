import React, { createContext, useState } from 'react';
import { mixpanelIdentify } from 'utils/analytics';
import { instantiateMaker } from '../maker';
import store from 'store';

export const MakerObjectContext = createContext();

function MakerHooksProvider({ children, rpcUrl, addresses, network }) {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
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

  // todo - far from final
  const newTxListener = transaction => {
    // todo listen to tx events too
    setTransactions([...transactions, transaction]);
  };

  // todo - far from final
  const resetTx = transaction => {
    // todo listen to tx events too
    setTransactions([]);
  };

  return (
    <MakerObjectContext.Provider
      value={{ maker, account, network, transactions, newTxListener, resetTx }}
    >
      {children}
    </MakerObjectContext.Provider>
  );
}

export default MakerHooksProvider;
