export const wallets = {
  IMTOKEN: 'imtoken',
  ALPHA: 'alphawallet',
  METAMASK: 'metamask',
  TRUST: 'trust',
  COINBASE: 'coinbase',
  CIPHER: 'cipher',
  MIST: 'mist',
  PARITY: 'parity',
  INFURA: 'infura',
  LOCALHOST: 'localhost',
  OTHER: 'other'
};

export function getWebClientProviderName() {
  if (window.imToken) return wallets.IMTOKEN;

  if (!window.web3 || typeof window.web3.currentProvider === 'undefined')
    return '';

  if (window.web3.currentProvider.isAlphaWallet) return wallets.ALPHA;

  if (window.web3.currentProvider.isMetaMask) return wallets.METAMASK;

  if (window.web3.currentProvider.isTrust) return wallets.TRUST;

  if (typeof window.SOFA !== 'undefined') return wallets.COINBASE;

  if (typeof window.__CIPHER__ !== 'undefined') return wallets.CIPHER;

  if (window.web3.currentProvider.constructor.name === 'EthereumProvider')
    return wallets.MIST;

  if (window.web3.currentProvider.constructor.name === 'Web3FrameProvider')
    return wallets.PARITY;

  if (
    window.web3.currentProvider.host &&
    window.web3.currentProvider.host.indexOf('infura') !== -1
  )
    return wallets.INFURA;

  if (
    window.web3.currentProvider.host &&
    window.web3.currentProvider.host.indexOf('localhost') !== -1
  )
    return wallets.LOCALHOST;

  return wallets.OTHER;
}
