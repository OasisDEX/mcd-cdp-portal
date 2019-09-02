import produce from 'immer';
import ilkList from 'references/ilkList';

export const tokensWithBalances = [
  'MDAI',
  'DAI',
  'MWETH',
  ...new Set(ilkList.map(ilk => ilk.gem))
];

const defaultAccountState = {
  balances: {}
};

const initialState = {};

const reducer = produce((draft, { type, value }) => {
  if (!type) return;

  // example type: accounts.0xdead...beef.balances.MWETH
  const [label, account, , token] = type.split('.');
  if (label === 'accounts') {
    if (!draft[account])
      draft[account] = Object.assign({}, defaultAccountState);

    draft[account].balances[token] = value;
  }
}, initialState);

export default reducer;
