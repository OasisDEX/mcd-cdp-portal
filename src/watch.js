import { createWatcher } from '@makerdao/multicall';
import store from './store';

import { batchActions } from 'utils/redux';
import { cdpSystemStateModel } from 'reducers/network/system/model';
import * as cdpTypeModel from 'reducers/network/cdpTypes/model';

import config from 'references/config.json';
import cdpTypes from 'references/cdpTypes';

const supportedCDPTypes = cdpTypes.filter(({ hidden }) => !hidden);
const multicallConfig = config.multicall.kovan;

const initialModel = [
  ...cdpSystemStateModel,
  ...supportedCDPTypes
    .map(({ key }) => cdpTypeModel.createCDPTypeModel(key))
    .reduce((acc, cur) => acc.concat(cur), []),
  cdpTypeModel.priceFeed('DGX', { decimals: 9 }),
  cdpTypeModel.priceFeed('BTC', { decimals: 18 })
];

const watcher = createWatcher(initialModel, multicallConfig);

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
