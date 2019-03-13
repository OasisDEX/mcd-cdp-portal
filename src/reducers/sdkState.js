// import maker from 'maker';
import store from 'store';
import { watcher } from '../watch';
import * as accountModel from 'reducers/network/account/model';

export const AUTHENTICATED = 'AUTHENTICATED';
export const ACCOUNT_SWITCHED = 'ACCOUNT_SWITCHED';

// maker.on('AUTHENTICATED', () => {
//   store.dispatch({ type: 'Authenticated' });
// });

export const switchAccount = address => {
  return function(dispatch) {
    dispatch({ type: ACCOUNT_SWITCHED, address });
    // Remove existing account balance watchers and add new ones for current address
    watcher.tap(model => {
      return [
        ...model.filter(calldata => calldata.type !== 'wallet_token_balance'),
        ...Object.keys(store.getState().network.account.tokens).map(key =>
          accountModel.accountTokenBalance(window.maker._addresses)(
            key,
            address
          )
        )
      ];
    });
  };
};

// maker.on('ACCOUNT_SWITCH', ({ address }) => {
//   store.dispatch({ type: 'AccountSwitch', address });
// });

// TODO: add these ^ events to dai.js

// setInterval(() => {
//   if (maker._container.isAuthenticated) {
//     try {
//       const currentAccount = maker.currentAccount();
//       const { activeAccountAddress } = store.getState().maker;
//       const { address, type: accountType } = currentAccount;
//       if (address !== activeAccountAddress)
//         store.dispatch({ type: 'AccountSwitch', address, accountType });
//     } catch (_) {}
//   }
// }, 250);

const initialState = {
  authenticated: false,
  activeAccountAddress: '',
  activeAccountType: ''
};

function sdkState(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATED:
      return { ...state, authenticated: true };
    case ACCOUNT_SWITCHED:
      console.debug(`Account switched: ${action.address}`);
      return {
        ...state,
        activeAccountAddress: action.address,
        activeAccountType: action.accountType
      };
    default:
      return state;
  }
}

export default sdkState;
