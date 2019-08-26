import { batchActions } from './utils/redux';
import ilks from './references/ilkList';
import { createCDPSystemModel } from './reducers/multicall/system';
import cdpTypeModel from './reducers/multicall/feeds';
import tokenModel from './reducers/multicall/balances';
import { isMissingContractAddress } from './utils/ethereum';
import { MDAI, MWETH } from '@makerdao/dai-plugin-mcd';

let watcher;

const currencies = [MDAI, MWETH, ...new Set(ilks.map(ilk => ilk.currency))];

export function startWatcher(maker, dispatch) {
  const service = maker.service('multicall');
  service.createWatcher();
  watcher = service.watcher;
  window.watcher = watcher;

  let currentAddress;
  try {
    currentAddress = maker.currentAddress();
  } catch (err) {}

  const addresses = maker.service('smartContract').getContractAddresses();
  // for convenience
  addresses.MDAI = addresses.MCD_DAI;
  addresses.MWETH = addresses.ETH;

  watcher.onNewBlock(blockHeight => {
    console.log('Latest block height:', blockHeight);
  });

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
      ...ilks.map(ilk => cdpTypeModel(addresses, ilk)).flat(),
      ...(currentAddress
        ? currencies
            .map(currency => tokenModel(addresses, currency, currentAddress))
            .flat()
        : [])
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
