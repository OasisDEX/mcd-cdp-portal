import React, { useState, useEffect } from 'react';

import { Button, Grid, Flex, Box } from '@makerdao/ui-components-core';
import styled from 'styled-components';

import { navigation } from '../index';

import { mixpanelIdentify } from 'utils/analytics';
import { cutMiddle, copyToClipboard } from '../utils/ui';
import { AccountTypes } from '../utils/constants';
import { addMkrAndEthBalance } from '../utils/ethereum';

import useMaker from 'hooks/useMaker';
import useMakerState from 'hooks/useMakerState';

import {
  AddressContainer,
  Table,
  InlineTd,
  CopyBtn,
  CopyBtnIcon
} from './AddressTable';

export const StyledTop = styled.div`
  display: flex;
  justify-content: center;
`;

export const StyledTitle = styled.div`
  font-weight: bold;
  color: #212536;
  line-height: 22px;
  font-size: 28px;
`;

export const StyledBlurb = styled.div`
  line-height: 22px;
  font-size: 17px;
  margin: 22px 0px 16px 0px;
`;

const onConfirm = async (maker, address, closeModal, accType) => {
  maker.useAccountWithAddress(address);
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

const TREZOR_PATH = "44'/60'/0'/0/0";
const LEDGER_LIVE_PATH = "44'/60'/0'";
const LEDGER_LEGACY_PATH = "44'/60'/0'/0";
const DEFAULT_ACCOUNTS_PER_PAGE = 5;

function HardwareWalletModal({ onClose, type, isLedgerLive }) {
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [accountCb, setAccountCb] = useState({});
  const { maker } = useMaker();
  const path =
    type === AccountTypes.TREZOR
      ? TREZOR_PATH
      : isLedgerLive
      ? LEDGER_LIVE_PATH
      : LEDGER_LEGACY_PATH;

  const walletAddresses = useMakerState(maker =>
    maker.addAccount({
      type,
      path,
      accountsOffset: 0,
      accountsLength: DEFAULT_ACCOUNTS_PER_PAGE,
      choose: async (addresses, cb) => {
        const addressBalancePromises = addresses.map(address =>
          addMkrAndEthBalance({
            address,
            type
          })
        );
        setAddressList(await Promise.all(addressBalancePromises));
        setAccountCb({ fn: cb });
      }
    })
  );

  useEffect(() => {
    walletAddresses.prefetch();
  }, []);

  return (
    <>
      <Flex justifyContent="flex-end">
        <Box onClick={onClose}>Close</Box>
      </Flex>
      <StyledTop>
        <StyledTitle>Select address</StyledTitle>
      </StyledTop>
      <StyledBlurb style={{ textAlign: 'center', marginTop: '14px' }}>
        Please select which address you would like to open
      </StyledBlurb>
      <AddressContainer>
        <Table>
          <thead>
            <tr>
              <th className="radio">Select</th>
              <th>#</th>
              <th>Address</th>
              <th>ETH</th>
              <th>MKR</th>
            </tr>
          </thead>
          <tbody>
            {addressList.map(({ address, ethBalance, mkrBalance }, index) => (
              <tr key={address}>
                <td className="radio">
                  <input
                    type="radio"
                    name="address"
                    value={index}
                    checked={address === selectedAddress}
                    onChange={() => setSelectedAddress(address)}
                  />
                </td>
                <td>{index + 1}</td>

                <InlineTd title={address}>
                  {cutMiddle(address, 7, 5)}
                  <CopyBtn onClick={() => copyToClipboard(address)}>
                    <CopyBtnIcon />
                  </CopyBtn>
                </InlineTd>
                <td>{ethBalance} ETH</td>
                <td>{mkrBalance} MKR</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </AddressContainer>
      <Grid
        gridRowGap="xs"
        gridColumnGap="s"
        gridTemplateColumns={['1fr', 'auto auto']}
        justifySelf={['stretch', 'center']}
      >
        <Button variant="secondary-outline" onClick={onClose}>
          Change wallet
        </Button>
        <Button
          disabled={!selectedAddress}
          onClick={() => {
            accountCb.fn(null, selectedAddress);
            setTimeout(() => onConfirm(maker, selectedAddress, onClose, type));
          }}
        >
          Confirm wallet
        </Button>
      </Grid>
    </>
  );
}

export default HardwareWalletModal;
