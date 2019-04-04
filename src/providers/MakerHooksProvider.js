import React, { createContext, useState } from 'react';
import { mixpanelIdentify } from 'utils/analytics';
import { instantiateMaker } from '../maker';
import store from 'store';

export const MakerObjectContext = createContext();

function MakerHooksProvider({ children, rpcUrl, addresses, network }) {
  const [account, setAccount] = useState(null);
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

  return (
    <MakerObjectContext.Provider value={{ maker, account, network }}>
      {children}
    </MakerObjectContext.Provider>
  );
}

export default MakerHooksProvider;
