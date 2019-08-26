import produce from 'immer';
import ilkList from 'references/ilkList';

const defaultTokenState = {
  balance: NaN
};

const symbols = [
  'MDAI',
  'DAI',
  'MWETH',
  ...new Set(ilkList.map(ilk => ilk.gem))
];

const defaultAccountState = symbols.reduce((acc, symbol) => {
  acc[symbol] = defaultTokenState;
  return acc;
}, {});

const initialState = {};

const reducer = produce((draft, { type, value }) => {
  if (!type) return;

  // example type: balance.0xdead...beef.MWETH
  const [label, account, token] = type.split('.');
  if (label === 'balance') {
    if (!draft[account]) draft[account] = defaultAccountState;
    if (!draft[account][token]) draft[account][token] = defaultTokenState;

    draft[account][token].balance = value;
  }
}, initialState);

export default reducer;
