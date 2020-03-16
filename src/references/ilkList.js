import { ETH, BAT, ZBTC } from '@makerdao/dai-plugin-mcd';

export default [
  {
    slug: 'eth-a', // URL param
    symbol: 'ETH-A', // how it's displayed in the UI
    key: 'ETH-A', // the actual ilk name used in the vat
    gem: 'ETH', // the actual asset that's being locked
    currency: ETH, // the associated dai.js currency type
    networks: ['kovan', 'mainnet', 'testnet', 'rinkeby', 'ropsten', 'goerli']
  },
  // {
  //   slug: 'eth-b',
  //   symbol: 'ETH-B',
  //   key: 'ETH-B',
  //   gem: 'ETH',
  //   currency: ETH
  // },
  // {
  //   slug: 'rep-a',
  //   symbol: 'REP-A',
  //   key: 'REP-A',
  //   gem: 'REP',
  //   currency: REP
  // },
  // {
  //   slug: 'zrx-a',
  //   symbol: 'ZRX-A',
  //   key: 'ZRX-A',
  //   gem: 'ZRX',
  //   currency: ZRX
  // },
  // {
  //   slug: 'omg-a',
  //   symbol: 'OMG-A',
  //   key: 'OMG-A',
  //   gem: 'OMG',
  //   currency: OMG
  // },
  {
    slug: 'bat-a',
    symbol: 'BAT-A',
    key: 'BAT-A',
    gem: 'BAT',
    currency: BAT,
    networks: ['kovan', 'mainnet', 'testnet', 'rinkeby', 'ropsten', 'goerli']
  },
  {
    slug: 'zbtc-a',
    symbol: 'ZBTC-A',
    key: 'ZBTC-A',
    gem: 'ZBTC',
    currency: ZBTC,
    networks: ['kovan', 'mainnet', 'testnet', 'rinkeby', 'ropsten', 'goerli']
  }
  // {
  //   slug: 'dgd-a',
  //   symbol: 'DGD-A',
  //   key: 'DGD-A',
  //   gem: 'DGD',
  //   currency: DGD,
  //   networks: ['kovan', 'mainnet'],
  //   decimals: 9
  // }
  // {
  //   slug: 'dgd-a',
  //   symbol: 'DGD-A',
  //   key: 'DGD-A',
  //   gem: 'DGD',
  //   currency: DGD,
  //   decimals: 9
  // }
];
