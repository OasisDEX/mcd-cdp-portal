import React, { useCallback } from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { Box, Dropdown, DefaultDropdown } from '@makerdao/ui-components-core';
import lang from 'languages';
import { mixpanelIdentify } from 'utils/analytics';

import BrowserProviderButton from 'components/BrowserProviderButton';
import IconButton from 'components/IconButton';
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

const StyledLedgerLogo = styled(LedgerLogo)`
  position: relative;
  top: 3px;
`;

export const StyledTrezorLogo = styled(TrezorLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

export const StyledWalletConnectLogo = styled(WalletConnectLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

const StyledWalletLinkLogo = styled(WalletLinkLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
  height: 21px;
  width: 21px;
`;

const buttonWidth = '248px';

const Button = styled(Box)`
  background-color: ${props => props.theme.colors.darkPurple};
  opacity: 0.8;
  border-radius: 40px;
  font-family: FT Base;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 18px;
  /* identical to box height, or 100% */
  width: ${buttonWidth};
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  letter-spacing: 0.5px;

  color: #ffffff;

  span {
    margin-right: 15.8px;
  }
`;

const DropdownItems = styled(DefaultDropdown)`
  background: #ffffff;
  border: 1px solid #ecf1f3;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding-left: 8px;
`;

function AccountSelection(props) {
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
      <Dropdown
        hitBoxMargin="8px 0"
        placement="center"
        trigger={
          <Button>
            <span>{lang.providers.connect_wallet}</span>
            <CaratDown />
          </Button>
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
              icon={<StyledWalletLinkLogo />}
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
              icon={<StyledWalletConnectLogo />}
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
              icon={<StyledLedgerLogo />}
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
              icon={<StyledTrezorLogo />}
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
    </Box>
  );
}

export default hot(AccountSelection);
