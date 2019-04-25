import { devToolsEnhancer } from 'redux-devtools-extension/developmentOnly';
import { createStore } from 'redux';
import { combineReducers } from 'redux';
import { enableBatching } from 'utils/redux';

import addresses from 'reducers/addresses';
import system from 'reducers/network/system';
import cdpTypes from 'reducers/network/cdpTypes';

const rootReducer = combineReducers({
  addresses,
  network: combineReducers({
    system,
    cdpTypes
  })
});

const store = createStore(enableBatching(rootReducer), devToolsEnhancer());

export default store;
