import React, { Fragment } from 'react';

import lang from 'languages';
import styled from 'styled-components';
import { Button, Flex } from '@makerdao/ui-components-core';
import { ReactComponent as TrezorLogo } from 'images/trezor.svg';
import { ReactComponent as LedgerLogo } from 'images/ledger.svg';

import useMaker from 'hooks/useMaker';
import useModal from 'hooks/useModal';

import { AccountTypes } from '../utils/constants';
import { navigation } from '../index';
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

const onConfirm = async (maker, closeModal, accType) => {
  const connectedAddress = maker.currentAddress();

  mixpanelIdentify(connectedAddress, accType);

  const { network } = navigation.receivedRoute.url.query;
  const addressToView = connectedAddress;
  navigation.history.push({
    pathname: `owner/${addressToView}`,
    search: `?network=${network}`
  });

  closeModal();
};

const renderAccountsSelection = ({
  maker,
  type,
  path,
  accountsOffset,
  accountsLength,
  show,
  reset
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
            closeModal: reset,
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
              pickAccount(null, address);
            }
          }
        });
      }
    })
    .then(() => onConfirm(maker, reset, type));
};

export default function HardwareWalletConnect({ type }) {
  const { maker, authenticated: makerAuthenticated } = useMaker();
  const { show, reset } = useModal();

  const isTrezor = type === AccountTypes.TREZOR;
  return (
    <Fragment>
      <Button
        variant="secondary-outline"
        width="225px"
        disabled={!makerAuthenticated}
        onClick={() =>
          isTrezor
            ? renderAccountsSelection({
                maker,
                type,
                path: TREZOR_PATH,
                accountsOffset: 0,
                accountsLength: DEFAULT_ACCOUNTS_PER_PAGE,
                show,
                reset
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
                      reset
                    })
                }
              })
        }
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
