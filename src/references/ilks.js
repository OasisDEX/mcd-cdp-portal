import { createCurrency } from '@makerdao/currency';

export default [
  {
    slug: 'weth', // URL param
    symbol: 'WETH', // how it's displayed in the UI
    key: 'ETH', // the actual ilk name used in the vat
    gem: 'WETH' // the actual asset that's being locked
  },
  // {
  //   slug: 'weth-a',
  //   symbol: 'WETH A',
  //   key: 'ETH-A',
  //   gem: 'WETH',
  // },
  // {
  //   slug: 'weth-b',
  //   symbol: 'WETH B',
  //   key: 'ETH-B',
  //   gem: 'WETH',
  // },
  {
    slug: 'rep',
    symbol: 'REP',
    key: 'REP',
    gem: 'REP'
  }
].map(ilk => ({ ...ilk, currency: createCurrency(ilk.gem) }));
