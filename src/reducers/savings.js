import produce from 'immer';
import BigNumber from 'bignumber.js';

const initialState = {
  Pie: new BigNumber(0),
  yearlyRate: new BigNumber(0),
  totalDai: new BigNumber(0),
  chi: new BigNumber(0),
  rho: new BigNumber(0),
  dsr: new BigNumber(0)
};

const reducer = produce((draft, { type, value }) => {
  if (!type) return;

  // example type: savings.dsr
  const [label, key] = type.split('.');
  if (label === 'savings') {
    draft[key] = value;
  }
}, initialState);

export default reducer;
