import { createWatcher } from '@makerdao/multicall/src/index';
import store from './store';
import { batchActions } from 'utils/redux';

import { cdpSystemStateModel } from 'reducers/network/system/model';
import { createCDPTypeModel } from 'reducers/network/cdpTypes/model';

import config from 'references/config.json';
import cdpTypes from 'references/cdpTypes';

const supportedCDPKeys = cdpTypes.map(({ key }) => key);
const multicallConfig = config.multicall.kovan;

const initialModel = [
  ...cdpSystemStateModel,
  ...supportedCDPKeys
    .map(key => createCDPTypeModel(key))
    .reduce((acc, cur) => acc.concat(cur), [])
];

const watcher = createWatcher(initialModel, multicallConfig);

watcher.batchStateDiffs().subscribe(newStateEvents => {
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
