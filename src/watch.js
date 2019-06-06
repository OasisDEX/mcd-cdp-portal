import { createWatcher } from '@makerdao/multicall';
import ilkList from './references/ilkList';
import { createCDPSystemModel } from './reducers/multicall/system';
import {
  flipper,
  ilkVatData,
  liquidation,
  rateData
} from './reducers/multicall/feeds';
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
    dispatch({ type: 'watcherUpdates', payload: updates });
    // dispatch(batchActions(updates));
  });

  // all bets are off wrt what contract state in our store
  dispatch({ type: 'CLEAR_CONTRACT_STATE' });
  watcher.start();
  // do our best to attach state listeners to this new network
  watcher.tap(() => {
    return [
      ...createCDPSystemModel(addresses),
      ...ilkList
        .map(({ key: ilk }) => [
          rateData(addresses)(ilk),
          ilkVatData(addresses)(ilk),
          liquidation(addresses)(ilk),
          flipper(addresses)(ilk)
        ])
        .flat()
    ].filter(calldata => !isMissingContractAddress(calldata)); // (limited by the addresses we have)
  });
  return watcher;
}

export function getWatcher() {
  if (!watcher) {
    console.warn('missing watcher... trying to recreate...');
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
