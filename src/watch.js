import { createWatcher } from '@makerdao/multicall';
import store from './store';

import { batchActions } from 'utils/redux';
import { createCDPSystemModel } from 'reducers/network/system/model';
import * as cdpTypeModel from 'reducers/network/cdpTypes/model';

import config from 'references/config.json';
import cdpTypes from 'references/cdpTypes';
import addresses from 'references/addresses';

const supportedCDPTypes = cdpTypes.filter(({ hidden }) => !hidden);

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
  rpcURL: rpcUrls[defaultNetwork],
  multicallAddress: defaultAddresses.MULTICALL
});

watcher.batch().subscribe(newStateEvents => {
  store.dispatch(batchActions(newStateEvents));
});

// watcher
//   .onNetworkTrouble(() => {
//     store.dispatch({ type: 'PROBLEM_FETCHING_STATE' });
//   })
//   .onResolution(() => {
//     store.dispatch({ type: 'NETWORK_PROBLEMS_RESOLVED' });
//   });

export default watcher;
