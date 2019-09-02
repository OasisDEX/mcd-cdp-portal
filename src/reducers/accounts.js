import produce from 'immer';
import ilkList from 'references/ilkList';
import BigNumber from 'bignumber.js';

export const tokensWithBalances = [
  'MDAI',
  'DAI',
  'MWETH',
  ...new Set(ilkList.map(ilk => ilk.gem))
];

const defaultAccountState = {
  balances: {},
  savings: new BigNumber(0)
};

const initialState = {};

// this math should eventually be moved into the SDK
export function getSavingsBalance(
  address,
  { accounts, savings: { Pie, chi, totalDai } }
) {
  const pie =
    (accounts[address] && accounts[address].savings) || new BigNumber(0);
  const slice = Pie.isZero() ? Pie : pie.div(Pie);

  return totalDai.times(slice);
}

const reducer = produce((draft, { type, value }) => {
  if (!type) return;

  // example type: accounts.0xdead...beef.balances.MWETH
  // example type: accounts.0xdead...beef.savings
  const [label, account, action, token] = type.split('.');
  if (label === 'accounts' && !draft[account]) {
    draft[account] = Object.assign({}, defaultAccountState);
  }

  if (label === 'accounts' && action === 'balances') {
    draft[account].balances[token] = value;
  } else if (label === 'accounts' && action === 'savings') {
    draft[account].savings = value;
  }
}, initialState);

export default reducer;
