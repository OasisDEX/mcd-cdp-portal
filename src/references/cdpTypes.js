import { ReactComponent as ethLogo } from '../images/eth.svg';

export default [
  {
    slug: 'eth', // url param
    symbol: 'ETH', // how it's displayed in the UI
    key: 'ETH', // the actual ilk key used in the vat
    logo: ethLogo
  },
  {
    slug: 'rep',
    symbol: 'REP',
    key: 'REP',
    logo: ethLogo
  }
];
