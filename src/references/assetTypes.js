import { ReactComponent as ethLogo } from '../images/eth.svg';

export const assetTypes = {
  DAI: {
    logo: ethLogo,
    color: '#fdc134',
    showInWallet: true
  },
  MKR: {
    logo: ethLogo,
    color: '#1aab9b',
    showInWallet: true
  },
  REP: {
    logo: ethLogo,
    color: '#2458e7',
    showInWallet: true
  }
};

export const shownAssetTypes = () =>
  Object.keys(assetTypes).filter(key => assetTypes[key].showInWallet);
