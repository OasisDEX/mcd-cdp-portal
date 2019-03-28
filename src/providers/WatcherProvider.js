import React, { createContext } from 'react';

import { recreateWatcher, getWatcher } from '../watch';

export const WatcherContext = createContext();

function WatcherProvider({ children, addresses, rpcUrl }) {
  const [watcher] = React.useState(() => getWatcher());

  React.useEffect(() => {
    if (rpcUrl && addresses) recreateWatcher({ rpcUrl, addresses });
  }, [addresses, rpcUrl]);

  return (
    <WatcherContext.Provider value={watcher}>
      {children}
    </WatcherContext.Provider>
  );
}

export default WatcherProvider;
