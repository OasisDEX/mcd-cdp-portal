import { getShownWalletGems } from 'references/gems';

export const TOKEN_BALANCE = 'balance';
export const TOKEN_UNLOCKED = 'unlocked';

export const setTokenAllowance = (key, unlocked) => {
  return {
    type: TOKEN_UNLOCKED,
    payload: { key, unlocked }
  };
};

export const getTokens = state => state.network.account.tokens;

const defaultTokenState = {
  [TOKEN_BALANCE]: null,
  [TOKEN_UNLOCKED]: false
};

const initialState = {
  tokens: getShownWalletGems().map(gem => ({ ...gem, ...defaultTokenState }))
};

export default function account(state = initialState, action) {
  const { type, value } = action;
  if (type === 'CLEAR_CONTRACT_STATE') return initialState;

  // example type: DAI.balance
  const [key, valueType] = type.split('.');

  if (Object.keys(defaultTokenState).includes(valueType)) {
    return {
      ...state,
      tokens: state.tokens.map(token =>
        token.key === key ? { ...token, [valueType]: value } : token
      )
    };
  }

  return state;
}
