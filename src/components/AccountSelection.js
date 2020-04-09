import React, { useCallback } from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { Box, Dropdown, DefaultDropdown } from '@makerdao/ui-components-core';
import lang from 'languages';
import { mixpanelIdentify } from 'utils/analytics';

import BrowserProviderButton from 'components/BrowserProviderButton';
import IconButton from 'components/IconButton';
import { FilledButton } from 'components/Marketing';

import { getWebClientProviderName } from 'utils/web3';
import useMaker from 'hooks/useMaker';
import { useLedger, useTrezor } from 'hooks/useHardwareWallet';

import { ReactComponent as TrezorLogo } from 'images/trezor.svg';
import { ReactComponent as LedgerLogo } from 'images/ledger.svg';
import { ReactComponent as WalletConnectLogo } from 'images/wallet-connect.svg';
import { ReactComponent as WalletLinkLogo } from 'images/wallet-link.svg';
import { ReactComponent as CaratDown } from 'images/carat-down-filled.svg';
import { AccountTypes } from 'utils/constants';
import { BrowserView } from 'react-device-detect';

const DropdownWrapper = styled(Box)`
  :hover {
    ${FilledButton} {
      background-color: #50445e;
    }
  }
`;

const DropdownItems = styled(DefaultDropdown)`
  min-width: 320px;
  background: #ffffff;
  border: 1px solid #ecf1f3;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 10px 7px 12px;
`;

function AccountSelection({ buttonWidth, ...props }) {
  const providerName = getWebClientProviderName();
  const {
    maker,
    authenticated: makerAuthenticated,
    connectBrowserProvider,
    connectToProviderOfType
  } = useMaker();

  const onAccountChosen = useCallback(
    async ({ address }, type) => {
      maker.useAccountWithAddress(address);
      mixpanelIdentify(address, type);
    },
    [maker]
  );
  const { connectTrezorWallet } = useTrezor({ onAccountChosen });
  const { connectLedgerWallet } = useLedger({ onAccountChosen });

  async function connectBrowserWallet() {
    try {
      const connectedAddress = await connectBrowserProvider();
      onAccountChosen({ address: connectedAddress }, providerName);
    } catch (err) {
      window.alert(err);
    }
  }

  return (
    <Box width={buttonWidth} {...props}>
      <DropdownWrapper>
        <Dropdown
          hitBoxMargin="8px 0"
          placement="bottom"
          trigger={
            <FilledButton width={buttonWidth}>
              <span style={{ marginRight: '15px' }}>
                {lang.providers.connect_wallet}
              </span>
              <CaratDown />
            </FilledButton>
          }
        >
          <DropdownItems>
            <BrowserProviderButton
              onClick={connectBrowserWallet}
              disabled={!makerAuthenticated}
              provider={providerName}
              css={{
                backgroundColor: 'white'
              }}
            />
            <BrowserView>
              <IconButton
                onClick={() => connectToProviderOfType(AccountTypes.WALLETLINK)}
                disabled={!makerAuthenticated}
                icon={<WalletLinkLogo />}
                css={{
                  backgroundColor: 'white'
                }}
              >
                {lang.landing_page.wallet_link}
              </IconButton>
            </BrowserView>
            <BrowserView>
              <IconButton
                onClick={() =>
                  connectToProviderOfType(AccountTypes.WALLETCONNECT)
                }
                icon={<WalletConnectLogo style={{ width: '28px' }} />}
                css={{
                  backgroundColor: 'white'
                }}
              >
                {lang.landing_page.wallet_connect}
              </IconButton>
            </BrowserView>
            <BrowserView>
              <IconButton
                onClick={connectLedgerWallet}
                disabled={!makerAuthenticated}
                icon={<LedgerLogo />}
                css={{
                  backgroundColor: 'white'
                }}
                iconSize="27px"
              >
                {lang.providers.ledger_nano}
              </IconButton>
            </BrowserView>
            <BrowserView>
              <IconButton
                onClick={connectTrezorWallet}
                disabled={!makerAuthenticated}
                icon={<TrezorLogo />}
                css={{
                  backgroundColor: 'white'
                }}
              >
                {lang.providers.trezor}
              </IconButton>
            </BrowserView>
            {/* <ReadOnlyConnect /> */}
          </DropdownItems>
        </Dropdown>
      </DropdownWrapper>
    </Box>
  );
}

export default hot(AccountSelection);
