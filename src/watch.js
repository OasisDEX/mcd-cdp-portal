import { createWatcher } from '@makerdao/multicall';
import store from './store';

import { batchActions } from 'utils/redux';

export function instantiateWatcher({ rpcUrl, multicallAddress }) {
  const watcher = createWatcher([], {
    rpcUrl,
    multicallAddress
  });

  watcher.batch().subscribe(newStateEvents => {
    store.dispatch(batchActions(newStateEvents));
  });

  window.watcher = watcher;
  return watcher;
}

// watcher
//   .onNetworkTrouble(() => {
//     store.dispatch({ type: 'PROBLEM_FETCHING_STATE' });
//   })
//   .onResolution(() => {
//     store.dispatch({ type: 'NETWORK_PROBLEMS_RESOLVED' });
//   });
