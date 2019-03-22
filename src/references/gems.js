import { createCurrency } from '@makerdao/currency';
import { ReactComponent as ethLogo } from '../images/eth.svg';

export const gems = [
  {
    logo: ethLogo,
    symbol: 'WETH', // how it's displayed in the UI
    key: 'WETH', // the unique gem name
    color: '#6680e3', // the strip color in the sidebar wallet
    decimals: 18, // the number of decimal places this gem uses
    showInWallet: false, // show this gem in the wallet as a token?
    showInFeeds: true // show this gem price in the price feeds?
  },
  {
    logo: ethLogo,
    symbol: 'REP',
    key: 'REP',
    color: '#2458e7',
    decimals: 18,
    showInWallet: false,
    showInFeeds: true
  },
  {
    logo: ethLogo,
    symbol: 'DAI',
    key: 'MDAI',
    color: '#fdc134',
    decimals: 18,
    showInWallet: true,
    showInFeeds: false
  },
  {
    logo: ethLogo,
    symbol: 'MKR',
    key: 'MKR',
    color: '#1aab9b',
    decimals: 18,
    showInWallet: true,
    showInFeeds: false
  }
].map(gem => ({ ...gem, currency: createCurrency(gem.key) }));

export const getCurrencies = () =>
  gems.map(({ key, currency }) => ({ [key]: currency }));
export const getShownWalletGems = () => gems.filter(gem => gem.showInWallet);
export const getShownFeedGems = () => gems.filter(gem => gem.showInFeeds);
