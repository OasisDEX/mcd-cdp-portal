import { devToolsEnhancer } from 'redux-devtools-extension/developmentOnly';
import { createStore } from 'redux';
import { combineReducers } from 'redux';
import { enableBatching } from 'utils/redux';

import sdkState from 'reducers/sdkState';
import addresses from 'reducers/addresses';
import account from 'reducers/network/account';
import system from 'reducers/network/system';
import ilks from 'reducers/network/ilks';

const rootReducer = combineReducers({
  sdkState,
  addresses,
  network: combineReducers({
    account,
    system,
    ilks
  })
});

const store = createStore(enableBatching(rootReducer), devToolsEnhancer());

export default store;
