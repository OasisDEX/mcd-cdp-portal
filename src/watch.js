import { createWatcher } from '@makerdao/multicall';
import store from './store';

import { batchActions } from 'utils/redux';

import config from 'references/config.json';
import addresses from 'references/addresses';

const { defaultNetwork, rpcUrls } = config;

const defaultAddresses = addresses[defaultNetwork];

const watcher = createWatcher([], {
  rpcUrl: rpcUrls[defaultNetwork],
  multicallAddress: defaultAddresses.MULTICALL
});

window.watcher = watcher;

watcher.batch().subscribe(newStateEvents => {
  store.dispatch(batchActions(newStateEvents));
});

let _rpcUrl = null;
export async function getOrRecreateWatcher({ rpcUrl, addresses }) {
  let reinstantiated = false;

  if (_rpcUrl !== rpcUrl) {
    if (addresses.MULTICALL === undefined)
      throw new Error('No multicall address found');

    _rpcUrl = rpcUrl;

    reinstantiated = true;

    await watcher.reCreate([], {
      rpcUrl,
      multicallAddress: addresses.MULTICALL
    });
  }
  return { watcher, reinstantiated };
}

// watcher
//   .onNetworkTrouble(() => {
//     store.dispatch({ type: 'PROBLEM_FETCHING_STATE' });
//   })
//   .onResolution(() => {
//     store.dispatch({ type: 'NETWORK_PROBLEMS_RESOLVED' });
//   });

export default watcher;
