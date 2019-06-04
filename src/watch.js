import { createWatcher } from '@makerdao/multicall';

let watcher = null;

export function instantiateWatcher({ rpcUrl, multicallAddress }) {
  watcher = createWatcher([], {
    rpcUrl,
    multicallAddress
  });

  window.watcher = watcher;
  return watcher;
}

export function getWatcher() {
  return watcher;
}

// watcher
//   .onNetworkTrouble(() => {
//     store.dispatch({ type: 'PROBLEM_FETCHING_STATE' });
//   })
//   .onResolution(() => {
//     store.dispatch({ type: 'NETWORK_PROBLEMS_RESOLVED' });
//   });
