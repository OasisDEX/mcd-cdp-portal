import { devToolsEnhancer } from 'redux-devtools-extension/developmentOnly';
import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux';
import { enableBatching } from 'utils/redux';
import thunk from 'redux-thunk';

import sdkState from 'reducers/sdkState';
import system from 'reducers/network/system';
import account from 'reducers/network/account';
import cdpTypes from 'reducers/network/cdpTypes';

const rootReducer = combineReducers({
  sdkState,
  network: combineReducers({
    system,
    account,
    cdpTypes
  })
});

const store = createStore(
  enableBatching(rootReducer),
  compose(
    applyMiddleware(thunk),
    devToolsEnhancer()
  )
);

export default store;
