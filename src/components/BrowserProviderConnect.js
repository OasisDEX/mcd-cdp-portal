import React from 'react';

import lang from 'languages';
import styled from 'styled-components';

import { useNavigation } from 'react-navi';
import { Button, Flex } from '@makerdao/ui-components-core';
import { ReactComponent as MetaMaskLogo } from 'images/metamask.svg';
import { ReactComponent as TrustLogo } from 'images/trust-logo.svg';
import { ReactComponent as ImTokenLogo } from 'images/imtoken-logo.svg';
import coinbaseWalletLogo from 'images/coinbase-wallet.png';
import alphaWalletLogo from 'images/alpha-wallet-logo.png';
import useMaker from 'hooks/useMaker';
import { wallets } from 'utils/web3';

// hack to get around button padding for now
const MMLogo = styled(MetaMaskLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

export default function BrowserProviderConnect({ provider }) {
  const {
    authenticated: makerAuthenticated,
    connectBrowserProvider
  } = useMaker();
  const navigation = useNavigation();

  return (
    <Button
      variant="secondary-outline"
      width="225px"
      disabled={!makerAuthenticated}
      onClick={async () => {
        try {
          const connectedAddress = await connectBrowserProvider();

          const { search } = (await navigation.getRoute()).url;

          navigation.navigate({
            pathname: `owner/${connectedAddress}`,
            search
          });
        } catch (err) {
          window.alert(err);
        }
      }}
    >
      <Flex alignItems="center">
        {provider === wallets.METAMASK && <MMLogo />}
        {provider === wallets.TRUST && <TrustLogo width="20px" height="20px" />}
        {provider === wallets.IMTOKEN && (
          <ImTokenLogo
            css={`
              pointer-events: none;
            `}
            width="20px"
            height="20px"
          />
        )}
        {provider === wallets.COINBASE && (
          <img src={coinbaseWalletLogo} width="20px" height="20px" alt="" />
        )}
        {provider === wallets.ALPHA && (
          <img src={alphaWalletLogo} width="20px" height="20px" alt="" />
        )}
        <span style={{ margin: 'auto' }}>
          {lang.providers[provider] || 'Active Wallet'}
        </span>
      </Flex>
    </Button>
  );
}
