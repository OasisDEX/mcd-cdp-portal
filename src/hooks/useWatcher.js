import { useContext } from 'react';

import { WatcherContext } from 'providers/WatcherProvider';

function useWatcher() {
  const watcher = useContext(WatcherContext);
  return { watcher };
}

export default useWatcher;
