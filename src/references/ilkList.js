import { ETH, REP, ZRX, OMG, BAT, DGD } from '@makerdao/dai-plugin-mcd';

export default [
  {
    slug: 'eth-a', // URL param
    symbol: 'ETH-A', // how it's displayed in the UI
    key: 'ETH-A', // the actual ilk name used in the vat
    gem: 'ETH', // the actual asset that's being locked
    currency: ETH, // the associated dai.js currency type
    networks: ['kovan', 'mainnet']
  },
  {
    slug: 'eth-b',
    symbol: 'ETH-B',
    key: 'ETH-B',
    gem: 'ETH',
    currency: ETH,
    networks: ['kovan', 'mainnet']
  },
  {
    slug: 'rep-a',
    symbol: 'REP-A',
    key: 'REP-A',
    gem: 'REP',
    currency: REP,
    networks: ['kovan', 'mainnet']
  },
  {
    slug: 'zrx-a',
    symbol: 'ZRX-A',
    key: 'ZRX-A',
    gem: 'ZRX',
    currency: ZRX,
    networks: ['kovan', 'mainnet']
  },
  {
    slug: 'omg-a',
    symbol: 'OMG-A',
    key: 'OMG-A',
    gem: 'OMG',
    currency: OMG,
    networks: ['kovan', 'mainnet']
  },
  {
    slug: 'bat-a',
    symbol: 'BAT-A',
    key: 'BAT-A',
    gem: 'BAT',
    currency: BAT,
    networks: ['kovan', 'mainnet']
  },
  {
    slug: 'dgd-a',
    symbol: 'DGD-A',
    key: 'DGD-A',
    gem: 'DGD',
    currency: DGD,
    networks: ['kovan', 'mainnet'],
    decimals: 9
  }
];
