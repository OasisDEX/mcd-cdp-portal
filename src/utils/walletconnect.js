import WalletConnector from '@walletconnect/browser';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';

const walletConnector = new WalletConnector({
  bridge: 'https://bridge.walletconnect.org'
});

export function getWalletConnectAccounts() {
  return new Promise((res, rej) => {
    if (!walletConnector.connected) {
      walletConnector.createSession().then(() => {
        const uri = walletConnector.uri;
        WalletConnectQRCodeModal.open(uri);
      });
    } else {
      const uri = walletConnector.uri;
      WalletConnectQRCodeModal.open(uri);
    }
    walletConnector.on('connect', (error, payload) => {
      if (error) rej(error);
      WalletConnectQRCodeModal.close();
      const { accounts, chainId } = payload.params[0];
      return res({ accounts, chainId });
    });
  });
}

export async function getWalletLinkAccounts({
  maker,
  onAccountChosenCallback
}) {
  console.log('getWalletLinkAccounts called');
  maker.addAccount({
    type: 'walletlink',
    calledFrom: 'portal',
    onAccountSelect: address => {
      console.log('testing callback address', address);
      onAccountChosenCallback(address, 'walletlink');
    }
  });
}
