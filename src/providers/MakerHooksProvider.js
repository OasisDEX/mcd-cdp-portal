import React, { createContext, useState } from 'react';
import { mixpanelIdentify } from 'utils/analytics';
import { instantiateMaker } from '../maker';
import store from 'store';

export const MakerObjectContext = createContext();

function MakerHooksProvider({ children, rpcUrl, addresses }) {
  const [account, setAccount] = useState(null);
  const [maker, setMaker] = useState(null);

  React.useEffect(() => {
    if (!rpcUrl || !addresses) return;
    instantiateMaker({ rpcUrl, addresses }).then(maker => {
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
    <MakerObjectContext.Provider value={{ maker, account }}>
      {children}
    </MakerObjectContext.Provider>
  );
}

export default MakerHooksProvider;
