import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { enableBatching } from 'utils/redux';

import watcherMiddleware from './watcherMiddleware';
import sdkState from '../reducers/sdkState';
import addresses from '../reducers/addresses';
import app from '../reducers/app';
import account from '../reducers/network/account';
import system from '../reducers/network/system';
import ilks from '../reducers/network/ilks';

const rootReducer = combineReducers({
  sdkState,
  addresses,
  app,
  network: combineReducers({
    account,
    system,
    ilks
  })
});

const store = createStore(
  enableBatching(rootReducer),
  composeWithDevTools(applyMiddleware(watcherMiddleware))
);

export default store;
