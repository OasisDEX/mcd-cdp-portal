import produce from 'immer';
import ilkList from 'references/ilkList';

const defaultTokenState = {
  balance: null
};

export const tokensWithBalances = [
  'MDAI',
  'DAI',
  'MWETH',
  ...new Set(ilkList.map(ilk => ilk.gem))
];

const defaultAccountState = tokensWithBalances.reduce((acc, symbol) => {
  acc[symbol] = Object.assign({}, defaultTokenState);
  return acc;
}, {});

const initialState = {};

const reducer = produce((draft, { type, value }) => {
  if (!type) return;

  // example type: accounts.0xdead...beef.balances.MWETH
  const [label, account, , token] = type.split('.');
  if (label === 'accounts') {
    if (!draft[account]) draft[account] = defaultAccountState;
    if (!draft[account][token])
      draft[account][token] = Object.assign({}, defaultTokenState);

    draft[account][token].balance = value;
  }
}, initialState);

export default reducer;
