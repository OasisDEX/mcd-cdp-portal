import { MWETH, COL1, COL2, COL3, COL4, COL5 } from '@makerdao/dai-plugin-mcd';

export default [
  {
    slug: 'eth-a', // URL param
    symbol: 'ETH-A', // how it's displayed in the UI
    key: 'ETH-A', // the actual ilk name used in the vat
    gem: 'WETH', // the actual asset that's being locked
    currency: MWETH // the associated dai.js currency type
    // (might be able replace "gem" completely)
  },
  {
    slug: 'eth-b',
    symbol: 'ETH-B',
    key: 'ETH-B',
    gem: 'WETH',
    currency: MWETH
  },
  {
    slug: 'col1-a',
    symbol: 'COL1-A',
    key: 'COL1-A',
    gem: 'COL1',
    currency: COL1
  },
  {
    slug: 'col2-a',
    symbol: 'COL2-A',
    key: 'COL2-A',
    gem: 'COL2',
    currency: COL2
  },
  {
    slug: 'col3-a',
    symbol: 'COL3-A',
    key: 'COL3-A',
    gem: 'COL3',
    currency: COL3
  },
  {
    slug: 'col4-a',
    symbol: 'COL4-A',
    key: 'COL4-A',
    gem: 'COL4',
    currency: COL4
  },
  {
    slug: 'col5-a',
    symbol: 'COL5-A',
    key: 'COL5-A',
    gem: 'COL5',
    currency: COL5
  }
];
