import { createWatcher } from '@makerdao/multicall';
import { batchActions } from './utils/redux';
import ilkList from './references/ilkList';
import { createCDPSystemModel } from './reducers/multicall/system';
import cdpTypeModel from './reducers/multicall/feeds';
import { isMissingContractAddress } from './utils/ethereum';

let watcher = null;

export function startWatcher({
  rpcUrl,
  multicallAddress,
  addresses,
  dispatch
}) {
  watcher = createWatcher([], { rpcUrl, multicallAddress });
  window.watcher = watcher;

  watcher.batch().subscribe(updates => {
    console.log('watcher got updates:', { updates });

    dispatch(batchActions(updates));

    // the advantage of this is that the entire list of updates is available in
    // a single reducer call
    dispatch({ type: 'watcherUpdates', payload: updates });
  });

  // all bets are off wrt what contract state in our store
  dispatch({ type: 'CLEAR_CONTRACT_STATE' });
  watcher.start();
  // do our best to attach state listeners to this new network
  watcher.tap(() => {
    return [
      ...createCDPSystemModel(addresses),
      ...ilkList.map(ilk => cdpTypeModel(addresses, ilk)).flat()
    ].filter(calldata => !isMissingContractAddress(calldata)); // (limited by the addresses we have)
  });
  return watcher;
}

export function getWatcher() {
  if (!watcher) {
    console.log('recreating watcher... this should only happen in development');
    return startWatcher();
  }
  return watcher;
}

// watcher
//   .onNetworkTrouble(() => {
//     store.dispatch({ type: 'PROBLEM_FETCHING_STATE' });
//   })
//   .onResolution(() => {
//     store.dispatch({ type: 'NETWORK_PROBLEMS_RESOLVED' });
//   });
