// import maker from 'maker';
// import store from 'store';

// maker.on('AUTHENTICATED', () => {
//   store.dispatch({ type: 'Authenticated' });
// });

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
    case 'Authenticated':
      return { ...state, authenticated: true };
    case 'ActiveAccountSwitched':
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
