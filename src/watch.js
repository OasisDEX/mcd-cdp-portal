import { createWatcher } from '@makerdao/multicall';

export function instantiateWatcher({ rpcUrl, multicallAddress }) {
  const watcher = createWatcher([], {
    rpcUrl,
    multicallAddress
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
