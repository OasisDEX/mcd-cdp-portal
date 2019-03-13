import { assetTypes, shownAssetTypes } from 'references/assetTypes';

export const ADD_TOKEN = 'ADD_TOKEN';
export const SET_TOKEN_ALLOWANCE = 'SET_TOKEN_ALLOWANCE';
export const ACCOUNT_TOKEN_BALANCE = 'accountBalance';

export const toggleTokenAllowance = (key, unlocked) => {
  return function(dispatch) {
    dispatch({
      type: SET_TOKEN_ALLOWANCE,
      payload: { key, unlockPending: true }
    });
    setTimeout(() => {
      if (
        window.confirm(
          (unlocked ? 'Approve' : 'Remove') + ' allowance for ' + key + '?'
        )
      ) {
        dispatch({
          type: SET_TOKEN_ALLOWANCE,
          payload: { key, unlocked, unlockPending: false }
        });
      } else {
        dispatch({
          type: SET_TOKEN_ALLOWANCE,
          payload: { key, unlockPending: false }
        });
      }
    }, 700);
  };
};

export const addToken = key => {
  return function(dispatch) {
    dispatch({
      type: ADD_TOKEN,
      payload: { key }
    });
  };
};

export const getTokens = state => state.network.account.tokens;

const assets = shownAssetTypes();
const initialState = {
  tokens: assets.reduce(
    (obj, asset) => (
      (obj[asset] = {
        balance: 1234,
        color: assetTypes[asset].color,
        unlocked: false,
        unlockPending: false
      }),
      obj
    ),
    {}
  )
};

function account(state = initialState, action) {
  const { type, value, payload } = action;
  if (type === 'CLEAR_CONTRACT_STATE') return initialState;

  // example type: DAI.accountBalance
  const [assetKey, valueType] = type.split('.');
  if (valueType === ACCOUNT_TOKEN_BALANCE) {
    return {
      ...state,
      tokens: {
        ...state.tokens,
        [assetKey]: {
          ...state.tokens[assetKey],
          balance: value
        }
      }
    };
  }
  if (type === ADD_TOKEN) {
    const { key, address } = payload;
    return {
      ...state,
      tokens: {
        ...state.tokens,
        [key]: {
          address: address,
          balance: 1234,
          color: assetTypes[key].color,
          unlocked: false,
          unlockPending: false
        }
      }
    };
  }
  if (type === SET_TOKEN_ALLOWANCE) {
    const { key } = payload;
    const token = state.tokens[key];
    return {
      ...state,
      tokens: {
        ...state.tokens,
        [key]: {
          ...token,
          ...payload
        }
      }
    };
  }
  return state;
}

export default account;
