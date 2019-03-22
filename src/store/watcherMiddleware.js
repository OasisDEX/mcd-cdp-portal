import {
  NETWORK_CHANGED,
  PROXY_CREATED,
  ADDRESS_CHANGED
} from '../reducers/app';
import { ADDRESSES_SET } from '../reducers/addresses';
import watcher from '../watch';

export default function watcherMiddleware({ getState, dispatch }) {
  return next => action => {
    switch (action.type) {
      case NETWORK_CHANGED:
        dispatch({ type: 'CLEAR_CONTRACT_STATE' });
        dispatch({
          type: ADDRESSES_SET,
          payload: { addresses: action.payload.addresses }
        });
        watcher.tapOnInitialize(action.payload.addresses);
        break;
      case PROXY_CREATED:
      case ADDRESS_CHANGED:
        const state = getState();
        if (action.payload.address !== state.app.address) {
          watcher.tapOnNewAddress(state.app.addresses);
        }
        if (action.payload.proxyAddress !== state.app.proxyAddress) {
          watcher.tapTokenAllowanceCalls(
            state.app.addresses,
            state.app.address,
            state.app.proxyAddress
          );
        }
        break;
      default:
        break;
    }

    return next(action);
  };
}
