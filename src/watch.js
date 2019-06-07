import { createWatcher } from '@makerdao/multicall';
import { batchActions } from './utils/redux';
import ilkList from './references/ilkList';
import { createCDPSystemModel } from './reducers/multicall/system';
import * as cdpTypeModel from './reducers/multicall/feeds';
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

  watcher.batch().subscribe(updates => dispatch(batchActions(updates)));

  // all bets are off wrt what contract state in our store
  dispatch({ type: 'CLEAR_CONTRACT_STATE' });
  watcher.start();
  // do our best to attach state listeners to this new network
  watcher.tap(() => {
    return [
      ...createCDPSystemModel(addresses),
      // cdpTypeModel.priceFeed(addresses)('WETH', { decimals: 18 }), // price feeds are by gem
      ...ilkList
        .map(({ key: ilk }) => [
          cdpTypeModel.rateData(addresses)(ilk),
          cdpTypeModel.ilkVatData(addresses)(ilk),
          cdpTypeModel.liquidation(addresses)(ilk),
          cdpTypeModel.flipper(addresses)(ilk)
        ])
        .flat()
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
