import produce from 'immer';
import BigNumber from 'bignumber.js';

import ilks from 'references/ilkList';

const uniqueIlkGems = [...new Set(ilks.map(ilk => ilk.gem))];

console.log('***', uniqueIlkGems);

export const tokensWithBalances = [
  ...new Set(['MDAI', 'ETH', 'DAI', 'MWETH', ...uniqueIlkGems])
];

const defaultAccountState = {
  balances: {},
  allowances: {},
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
  const [label, account, key, token] = type.split('.');
  if (label === 'accounts' && !draft[account]) {
    console.log('***1 accounts reducer', defaultAccountState);
    draft[account] = Object.assign({}, defaultAccountState);
  }

  if (label === 'accounts' && key === 'balances') {
    draft[account].balances[token] = value;
  } else if (label === 'accounts' && key === 'allowances') {
    draft[account].allowances[token] = value;
  } else if (label === 'accounts' && key === 'savings') {
    draft[account].savings = value;
  }
  console.log('***account final', account);
}, initialState);

export default reducer;
