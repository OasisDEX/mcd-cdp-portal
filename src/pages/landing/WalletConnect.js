import React, { useState, useEffect } from 'react';

import lang from 'languages';
import styled from 'styled-components';

import { Button, Flex } from '@makerdao/ui-components';
import { ReactComponent as Logo } from 'images/wallet-connect.svg';

// import WalletConnecter from 'walletconnect';
// import WalletConnectQRCodeModal from 'walletconnect-qrcode-modal';

// const webConnector = new WalletConnecter({
//   bridgeUrl: 'https://test-bridge.walletconnect.org',
//   dappName: 'MCD-CDP-Portal'
// });

// async function getWalletConnectAccounts() {
//   let accounts;
//   if (webConnector.isConnected) {
//     accounts = webConnector.accounts;
//   } else {
//     const uri = webConnector.uri;
//     WalletConnectQRCodeModal.open(uri);
//     await webConnector.listenSessionStatus();
//     webConnector.stopLastListener();
//     WalletConnectQRCodeModal.close();
//     accounts = webConnector.accounts;
//   }
//   return accounts;
// }

// hack to get around button padding for now
const WalletConnectLogo = styled(Logo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

function WalletConnect() {
  const [walletConnectReady, setWalletConnectReady] = useState(false);

  useEffect(() => {
    // webConnector.initSession().then(() => {
    setWalletConnectReady(true);
    // });
  }, []);

  return (
    <>
      <Button
        variant="secondary-outline"
        disabled={!walletConnectReady}
        width="225px"
        onClick={async () => {
          // const accounts = await getWalletConnectAccounts();
          // console.log(accounts);
        }}
      >
        <Flex alignItems="center">
          <WalletConnectLogo />
          <span style={{ margin: 'auto' }}>
            {lang.landing_page.wallet_connect}
          </span>
        </Flex>
      </Button>
    </>
  );
}

export default WalletConnect;
