import React, { createContext } from 'react';
import { instantiateMaker } from '../maker';
import store from 'store';

export const MakerObjectContext = createContext();

function MakerHooksProvider({ children, rpcUrl, addresses }) {
  const [maker, setMaker] = React.useState(null);

  React.useEffect(() => {
    if (!rpcUrl || !addresses) return;
    instantiateMaker({ rpcUrl, addresses }).then(maker => {
      store.dispatch({ type: 'addresses/set', payload: { addresses } });
      setMaker(maker);
    });
    // NOTE: returning a function here would be a good way to remove stale dai.js event listeners
  }, [rpcUrl, addresses]);

  return (
    <MakerObjectContext.Provider value={maker}>
      {children}
    </MakerObjectContext.Provider>
  );
}

export default MakerHooksProvider;
