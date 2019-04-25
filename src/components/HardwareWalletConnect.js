import React, { Fragment } from 'react';

import lang from 'languages';
import styled from 'styled-components';
import { Button, Flex } from '@makerdao/ui-components-core';
import { ReactComponent as TrezorLogo } from 'images/trezor.svg';
import { ReactComponent as LedgerLogo } from 'images/ledger.svg';

import useMaker from 'hooks/useMaker';
import useModal from 'hooks/useModal';

import { AccountTypes } from '../utils/constants';
import { useNavigation } from 'react-navi';
import { mixpanelIdentify } from 'utils/analytics';

const StyledLedgerLogo = styled(LedgerLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

const StyledTrezorLogo = styled(TrezorLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

const TREZOR_PATH = "44'/60'/0'/0/0";
const DEFAULT_ACCOUNTS_PER_PAGE = 25;

const renderAccountsSelection = ({
  maker,
  type,
  path,
  accountsOffset,
  accountsLength,
  show,
  onConfirm
}) => {
  maker
    .addAccount({
      type,
      path,
      accountsOffset,
      accountsLength,
      choose: (addressList, pickAccount) => {
        show({
          modalType: type,
          modalProps: {
            addressList,
            fetchAccounts: offset => {
              return new Promise(resolve => {
                maker.addAccount({
                  type,
                  path,
                  accountsOffset: offset,
                  accountsLength,
                  choose: addresses => {
                    resolve(addresses);
                  }
                });
              });
            },
            confirmAddress: address => {
              const matchedAccount = maker
                .listAccounts()
                .find(
                  acc => acc.address.toUpperCase() === address.toUpperCase()
                );
              if (matchedAccount) {
                onConfirm(matchedAccount, type);
              } else {
                pickAccount(null, address);
              }
            }
          }
        });
      }
    })
    .then(account => onConfirm(account, type))
    .catch(err => console.error('Failed to add account', err));
};

export default function HardwareWalletConnect({ type }) {
  const { maker, authenticated: makerAuthenticated } = useMaker();
  const navigation = useNavigation();
  const { show } = useModal();

  async function onConfirm(account, accType) {
    maker.useAccountWithAddress(account.address);
    const connectedAddress = maker.currentAddress();
    mixpanelIdentify(connectedAddress, accType);

    const { search } = (await navigation.getRoute()).url;

    navigation.navigate({
      pathname: `owner/${connectedAddress}`,
      search
    });
  }

  const isTrezor = type === AccountTypes.TREZOR;
  return (
    <Fragment>
      <Button
        variant="secondary-outline"
        width="225px"
        disabled={!makerAuthenticated}
        onClick={() => {
          isTrezor
            ? renderAccountsSelection({
                maker,
                type,
                path: TREZOR_PATH,
                accountsOffset: 0,
                accountsLength: DEFAULT_ACCOUNTS_PER_PAGE,
                show,
                onConfirm
              })
            : show({
                modalType: 'ledgertype',
                modalProps: {
                  renderByPath: path =>
                    renderAccountsSelection({
                      maker,
                      type,
                      path,
                      accountsOffset: 0,
                      accountsLength: DEFAULT_ACCOUNTS_PER_PAGE,
                      show,
                      onConfirm
                    })
                }
              });
        }}
      >
        <Flex alignItems="center">
          {isTrezor ? <StyledTrezorLogo /> : <StyledLedgerLogo />}
          <span style={{ margin: 'auto' }}>
            {isTrezor
              ? lang.landing_page.trezor
              : lang.landing_page.ledger_nano}
          </span>
        </Flex>
      </Button>
    </Fragment>
  );
}
