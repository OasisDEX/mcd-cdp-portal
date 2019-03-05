import React from 'react';

import lang from 'languages';
import styled from 'styled-components';

import { Button, Flex } from '@makerdao/ui-components-core';
import { ReactComponent as Logo } from 'images/wallet-connect.svg';

import WalletConnector from '@walletconnect/browser';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';

const walletConnector = new WalletConnector({
  bridge: 'https://bridge.walletconnect.org'
});

function getWalletConnectAccounts() {
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
      rej(error);
      WalletConnectQRCodeModal.close();
      const { accounts, chainId } = payload.params[0];
      return res({ accounts, chainId });
    });
  });
}

// hack to get around button padding for now
const WalletConnectLogo = styled(Logo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

function WalletConnect() {
  return (
    <Button
      variant="secondary-outline"
      width="225px"
      onClick={async () => {
        const { accounts, chainId } = await getWalletConnectAccounts();
        console.log('Wallet Connect accounts', accounts);
        console.log('Wallet Connect chain id', chainId);
      }}
    >
      <Flex alignItems="center">
        <WalletConnectLogo />
        <span style={{ margin: 'auto' }}>
          {lang.landing_page.wallet_connect}
        </span>
      </Flex>
    </Button>
  );
}

export default WalletConnect;
