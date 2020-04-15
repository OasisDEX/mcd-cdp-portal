import React, { useMemo } from 'react';
import styled from 'styled-components';

import { ReactComponent as MetaMaskLogo } from 'images/metamask.svg';
import { ReactComponent as TrustLogo } from 'images/trust-logo.svg';
import coinbaseWalletLogo from 'images/coinbase-wallet.png';
import alphaWalletLogo from 'images/alpha-wallet-logo.png';
import { wallets } from 'utils/web3';
import ImTokenLogo from 'components/ImTokenLogo';

const MMLogo = styled(MetaMaskLogo)`
  margin: -5px 0;
`;

const useBrowserIcon = provider =>
  useMemo(() => {
    if (provider === wallets.METAMASK) {
      return <MMLogo />;
    } else if (provider === wallets.TRUST) {
      return <TrustLogo />;
    } else if (provider === wallets.IMTOKEN) {
      return (
        <ImTokenLogo
          css={`
            pointer-events: none;
          `}
        />
      );
    } else if (provider === wallets.COINBASE) {
      return <img src={coinbaseWalletLogo} alt="" />;
    } else if (provider === wallets.ALPHA) {
      return <img src={alphaWalletLogo} alt="" />;
    } else {
      return <div />;
    }
  }, [provider]);

export default useBrowserIcon;
