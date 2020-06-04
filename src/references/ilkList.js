import { ETH, BAT, USDC, WBTC, TUSD } from '@makerdao/dai-plugin-mcd';

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
  }
];
