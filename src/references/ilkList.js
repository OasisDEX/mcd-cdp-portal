import {
  ETH,
  BAT,
  USDC,
  WBTC,
  TUSD,
  ZRX,
  KNC,
  MANA,
  USDT,
  PAXUSD,
  COMP,
  LRC,
  LINK
} from '@makerdao/dai-plugin-mcd';

export default [
  {
    slug: 'eth-a', // URL param
    symbol: 'ETH-A', // how it's displayed in the UI
    key: 'ETH-A', // the actual ilk name used in the vat
    gem: 'ETH', // the actual asset that's being locked
    currency: ETH, // the associated dai.js currency type
    networks: ['kovan', 'mainnet', 'testnet', 'rinkeby', 'ropsten', 'goerli']
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
    slug: 'bat-a',
    symbol: 'BAT-A',
    key: 'BAT-A',
    gem: 'BAT',
    currency: BAT,
    networks: ['kovan', 'mainnet', 'testnet', 'rinkeby', 'ropsten', 'goerli']
  },
  {
    slug: 'usdc-a',
    symbol: 'USDC-A',
    key: 'USDC-A',
    gem: 'USDC',
    currency: USDC,
    networks: ['kovan', 'mainnet', 'testnet', 'rinkeby', 'ropsten', 'goerli'],
    decimals: 6
  },
  {
    slug: 'usdc-b',
    symbol: 'USDC-B',
    key: 'USDC-B',
    gem: 'USDC',
    currency: USDC,
    networks: ['kovan', 'mainnet'],
    decimals: 6
  },
  {
    slug: 'wbtc-a',
    symbol: 'WBTC-A',
    key: 'WBTC-A',
    gem: 'WBTC',
    currency: WBTC,
    networks: ['kovan', 'mainnet'],
    decimals: 8
  },
  {
    slug: 'tusd-a',
    symbol: 'TUSD-A',
    key: 'TUSD-A',
    gem: 'TUSD',
    currency: TUSD,
    networks: ['kovan', 'mainnet']
  },
  {
    slug: 'knc-a',
    symbol: 'KNC-A',
    key: 'KNC-A',
    gem: 'KNC',
    currency: KNC,
    networks: ['mainnet', 'kovan']
  },
  {
    slug: 'zrx-a',
    symbol: 'ZRX-A',
    key: 'ZRX-A',
    gem: 'ZRX',
    currency: ZRX,
    networks: ['mainnet', 'kovan']
  },
  {
    slug: 'mana-a',
    symbol: 'MANA-A',
    key: 'MANA-A',
    gem: 'MANA',
    currency: MANA,
    networks: ['mainnet', 'kovan']
  },
  {
    slug: 'usdt-a',
    symbol: 'USDT-A',
    key: 'USDT-A',
    gem: 'USDT',
    currency: USDT,
    networks: ['mainnet', 'kovan'],
    decimals: 6
  },
  {
    slug: 'paxusd-a',
    symbol: 'PAXUSD-A',
    key: 'PAXUSD-A',
    gem: 'PAXUSD',
    currency: PAXUSD,
    networks: ['mainnet', 'kovan']
  },
  {
    slug: 'comp-a',
    symbol: 'COMP-A',
    key: 'COMP-A',
    gem: 'COMP',
    currency: COMP,
    networks: ['mainnet', 'kovan']
  },
  {
    slug: 'lrc-a',
    symbol: 'LRC-A',
    key: 'LRC-A',
    gem: 'LRC',
    currency: LRC,
    networks: ['mainnet', 'kovan']
  },
  {
    slug: 'link-a',
    symbol: 'LINK-A',
    key: 'LINK-A',
    gem: 'LINK',
    currency: LINK,
    networks: ['mainnet', 'kovan']
  }
];
