import { createCurrency } from '@makerdao/currency';

const REP = createCurrency('REP');
const WETH = createCurrency('WETH');

export default [
  {
    slug: 'weth', // URL param
    symbol: 'WETH', // how it's displayed in the UI
    key: 'ETH', // the actual ilk name used in the vat
    gem: 'WETH', // the actual asset that's being locked
    currency: WETH // the associated dai.js currency type
    // (might be able replace "gem" completely)
  },
  {
    slug: 'rep',
    symbol: 'REP',
    name: 'REP',
    key: 'REP',
    gem: 'REP',
    currency: REP
  }
];
