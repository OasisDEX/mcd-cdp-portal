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
  LINK,
  YFI,
  BAL,
  GUSD,
  UNI,
  RENBTC,
  AAVE,
  UNIV2DAIETH,
  UNIV2WBTCETH,
  UNIV2USDCETH
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
  },
  {
    slug: 'yfi-a',
    symbol: 'YFI-A',
    key: 'YFI-A',
    gem: 'YFI',
    currency: YFI,
    networks: ['mainnet', 'kovan']
  },
  {
    slug: 'bal-a',
    symbol: 'BAL-A',
    key: 'BAL-A',
    gem: 'BAL',
    currency: BAL,
    networks: ['mainnet', 'kovan']
  },
  {
    slug: 'gusd-a',
    symbol: 'GUSD-A',
    key: 'GUSD-A',
    gem: 'GUSD',
    currency: GUSD,
    networks: ['mainnet', 'kovan']
  },
  {
    slug: 'uni-a',
    symbol: 'UNI-A',
    key: 'UNI-A',
    gem: 'UNI',
    currency: UNI,
    networks: ['mainnet', 'kovan']
  },
  {
    slug: 'renbtc-a',
    symbol: 'RENBTC-A',
    key: 'RENBTC-A',
    gem: 'RENBTC',
    currency: RENBTC,
    networks: ['mainnet', 'kovan']
  },
  {
    slug: 'aave-a',
    symbol: 'AAVE-A',
    key: 'AAVE-A',
    gem: 'AAVE',
    currency: AAVE,
    networks: ['mainnet', 'kovan']
  },
  {
    slug: 'univ2daieth-a',
    symbol: 'UNIV2DAIETH-A',
    key: 'UNIV2DAIETH-A',
    gem: 'UNIV2DAIETH',
    currency: UNIV2DAIETH,
    networks: ['mainnet', 'kovan']
  },
  {
    slug: 'univ2wbtceth-a',
    symbol: 'UNIV2WBTCETH-A',
    key: 'UNIV2WBTCETH-A',
    gem: 'UNIV2WBTCETH',
    currency: UNIV2WBTCETH,
    networks: ['mainnet']
  },
  {
    slug: 'univ2usdceth-a',
    symbol: 'UNIV2USDCETH-A',
    key: 'UNIV2USDCETH-A',
    gem: 'UNIV2USDCETH',
    currency: UNIV2USDCETH,
    networks: ['mainnet']
  },
];
