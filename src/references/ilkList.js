import { createCurrency } from '@makerdao/currency';

const WETH = createCurrency('WETH');
const COL1 = createCurrency('COL1');
const COL2 = createCurrency('COL2');
const COL3 = createCurrency('COL3');
const COL4 = createCurrency('COL4');
const COL5 = createCurrency('COL5');

export default [
  {
    slug: 'weth-a', // URL param
    symbol: 'WETH-A', // how it's displayed in the UI
    key: 'ETH-A', // the actual ilk name used in the vat
    gem: 'WETH', // the actual asset that's being locked
    currency: WETH // the associated dai.js currency type
    // (might be able replace "gem" completely)
  },
  {
    slug: 'weth-b',
    symbol: 'WETH-B',
    key: 'ETH-B',
    gem: 'WETH',
    currency: WETH
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
