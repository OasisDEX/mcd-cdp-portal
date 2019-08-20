import { batchActions } from './utils/redux';
import ilkList from './references/ilkList';
import { createCDPSystemModel } from './reducers/multicall/system';
import cdpTypeModel from './reducers/multicall/feeds';
import { isMissingContractAddress } from './utils/ethereum';

let watcher;

export function startWatcher(maker, dispatch) {
  const service = maker.service('multicall');
  service.createWatcher();
  watcher = service.watcher;
  window.watcher = watcher;

  const addresses = maker.service('smartContract').getContractAddresses();

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
  return watcher;
}

// watcher
//   .onNetworkTrouble(() => {
//     store.dispatch({ type: 'PROBLEM_FETCHING_STATE' });
//   })
//   .onResolution(() => {
//     store.dispatch({ type: 'NETWORK_PROBLEMS_RESOLVED' });
//   });
