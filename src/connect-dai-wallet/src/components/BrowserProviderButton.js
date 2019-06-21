import React, { useMemo } from 'react';

import lang from 'languages';
import styled from 'styled-components';

import { ReactComponent as MetaMaskLogo } from '../images/metamask.svg';
import { ReactComponent as TrustLogo } from '../images/trust-logo.svg';
import { ReactComponent as ImTokenLogo } from '../images/imtoken-logo.svg';
import coinbaseWalletLogo from '../images/coinbase-wallet.png';
import alphaWalletLogo from '../images/alpha-wallet-logo.png';
import { wallets } from '../utils/web3';
import IconButton from './IconButton';

// hack to get around button padding for now
const MMLogo = styled(MetaMaskLogo)`
  margin-top: -5px
  margin-bottom: -5px
`;

export default function BrowserProviderButton({ provider, ...props }) {
  const icon = useMemo(() => {
    if (provider === wallets.METAMASK) {
      return <MMLogo />;
    } else if (provider === wallets.TRUST) {
      return <TrustLogo width="20px" height="20px" />;
    } else if (provider === wallets.IMTOKEN) {
      return (
        <ImTokenLogo
          css={`
            pointer-events: none;
          `}
          width="20px"
          height="20px"
        />
      );
    } else if (provider === wallets.COINBASE) {
      return <img src={coinbaseWalletLogo} width="20px" height="20px" alt="" />;
    } else if (provider === wallets.ALPHA) {
      return <img src={alphaWalletLogo} width="20px" height="20px" alt="" />;
    } else {
      return <div />;
    }
  }, [provider]);

  return (
    <IconButton icon={icon} {...props}>
      {lang.providers[provider] || 'Active Wallet'}
    </IconButton>
  );
}
