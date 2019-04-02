import React, { createContext } from 'react';

import { instantiateWatcher } from '../watch';

export const WatcherContext = createContext();

function WatcherProvider({ children, rpcUrl, addresses }) {
  const [watcher, setWatcher] = React.useState(null);

  React.useEffect(() => {
    if (rpcUrl && addresses) {
      const { MULTICALL } = addresses;

      if (!MULTICALL) {
        console.error('No multicall address found', addresses);
        return;
      }

      const _watcher = instantiateWatcher({
        rpcUrl,
        multicallAddress: MULTICALL
      });

      setWatcher(_watcher);
      _watcher.start();
    }
  }, [addresses, rpcUrl]);

  return (
    <WatcherContext.Provider value={{ watcher }}>
      {children}
    </WatcherContext.Provider>
  );
}

export default WatcherProvider;
