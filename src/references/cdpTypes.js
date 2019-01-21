import { ReactComponent as ethLogo } from '../images/eth.svg';

export default [
  {
    slug: 'eth', // url param
    symbol: 'ETH', // how it's displayed in the UI
    key: 'ETH', // the actual ilk key used in the vat
    logo: ethLogo,
    hidden: false
  },
  {
    slug: 'rep',
    symbol: 'REP',
    key: 'REP',
    logo: ethLogo,
    hidden: false
  },
  {
    slug: 'btc',
    symbol: 'BTC',
    key: 'BTC',
    logo: ethLogo,
    hidden: true
  },
  {
    slug: 'dgx',
    symbol: 'DGX',
    key: 'DGX',
    logo: ethLogo,
    hidden: true
  }
];
