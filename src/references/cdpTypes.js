import { ReactComponent as ethLogo } from '../images/eth.svg';

export default [
  // {
  //   slug: 'eth', // url param
  //   symbol: 'ETH', // how it's displayed in the UI
  //   key: 'ETH', // the actual ilk key used in the vat
  //   gem: 'ETH',
  //   logo: ethLogo,
  //   hidden: true
  // },
  // {
  //   slug: 'weth', // url param
  //   symbol: 'WETH', // how it's displayed in the UI
  //   key: 'ETH', // the actual ilk key used in the vat
  //   gem: 'WETH',
  //   logo: ethLogo,
  //   hidden: false
  // },
  {
    slug: 'rep',
    symbol: 'REP',
    ilkKey: 'REP',
    gemKey: 'REP',
    key: 'REP',
    gem: 'REP',
    logo: ethLogo,
    hidden: false
  },
  {
    slug: 'btc',
    symbol: 'BTC',
    ilkKey: 'BTC',
    gemKey: 'BTC',
    key: 'BTC',
    gem: 'BTC',
    logo: ethLogo,
    hidden: true
  },
  {
    slug: 'dgx',
    symbol: 'DGX',
    ilkKey: 'DGX',
    gemKey: 'DGX',
    gem: 'DGX',
    key: 'DGX',
    logo: ethLogo,
    hidden: true
  }
];
