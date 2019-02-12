import { createWatcher } from '@makerdao/multicall';
import store from './store';

import { batchActions } from 'utils/redux';
import { createCDPSystemModel } from 'reducers/network/system/model';
// import * as cdpTypeModel from 'reducers/network/cdpTypes/model';

import config from 'references/config.json';
// import cdpTypes from 'references/cdpTypes';
import addresses from 'references/addresses';

// const supportedCDPTypes = cdpTypes.filter(({ hidden }) => !hidden);

const { defaultNetwork, rpcUrls } = config;

const defaultAddresses = addresses[defaultNetwork];

const initialModel = [
  ...createCDPSystemModel(defaultAddresses)
  // ...cdpSystemStateModel,
  // ...supportedCDPTypes
  //   .map(({ key }) => cdpTypeModel.createCDPTypeModel(key))
  //   .reduce((acc, cur) => acc.concat(cur), []),
  // cdpTypeModel.priceFeed('DGX', { decimals: 9 }),
  // cdpTypeModel.priceFeed('BTC', { decimals: 18 })
];

const watcher = createWatcher(initialModel, {
  rpcUrl: rpcUrls[defaultNetwork],
  multicallAddress: defaultAddresses.MULTICALL
});

window.watcher = watcher;

watcher.batch().subscribe(newStateEvents => {
  store.dispatch(batchActions(newStateEvents));
});

let _rpcUrl = null;
export async function getOrRecreateWatcher({ rpcUrl, addresses }) {
  if (_rpcUrl !== rpcUrl) {
    if (addresses.MULTICALL === undefined)
      throw new Error('Multicall address not defined');
    await watcher.reCreate([], {
      rpcUrl,
      multicallAddress: addresses.MULTICALL
    });
    return watcher;
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

export default watcher;
