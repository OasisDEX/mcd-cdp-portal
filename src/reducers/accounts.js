import produce from 'immer';
import BigNumber from 'bignumber.js';

import ilks from 'references/ilkList';

const uniqueIlkGems = [...new Set(ilks.map(ilk => ilk.gem))];

export const tokensWithBalances = [
  ...new Set(['MDAI', 'DSR', 'ETH', 'DAI', 'MWETH', ...uniqueIlkGems])
];

const defaultAccountState = {
  balances: {},
  allowances: {},
  savings: new BigNumber(0)
};

const initialState = {};

// this math should eventually be moved into the SDK
// export function getSavingsBalance(
//   address,
//   { accounts, savings: { Pie, chi, totalDai } }
// ) {
//   const pie =
//     (accounts[address] && accounts[address].savings) || new BigNumber(0);
//   const slice = Pie.isZero() ? Pie : pie.div(Pie);

//   return totalDai.times(slice);
// }

const reducer = produce((draft, { type, value }) => {
  if (!type) return;

  // example type: accounts.0xdead...beef.balances.MWETH
  // example type: accounts.0xdead...beef.savings
  const [label, account, key, token] = type.split('.');
  if (label === 'accounts' && !draft[account]) {
    draft[account] = Object.assign({}, defaultAccountState);
  }

  // TODO Only instantiate balances and allowances for the tokens that are eligible for them
  if (label === 'accounts' && key === 'balances') {
    draft[account].balances[token] = value;
  } else if (label === 'accounts' && key === 'allowances') {
    draft[account].allowances[token] = value;
  } else if (label === 'accounts' && key === 'savings') {
    draft[account].savings = value;
  }
}, initialState);

export default reducer;
