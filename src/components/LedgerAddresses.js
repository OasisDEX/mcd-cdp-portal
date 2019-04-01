import React, { useState, useEffect } from 'react';

import { Button, Grid, Flex, Box } from '@makerdao/ui-components-core';
import styled from 'styled-components';
import { useNavigation } from 'react-navi';

import { mixpanelIdentify } from 'utils/analytics';
import { cutMiddle, copyToClipboard } from '../utils/ui';
import { AccountTypes } from '../utils/constants';
import { addMkrAndEthBalance } from '../utils/ethereum';

import useMaker from 'hooks/useMaker';
import useMakerState from 'hooks/useMakerState';
import useModal from 'hooks/useModal';

import {
  AddressContainer,
  Table,
  InlineTd,
  CopyBtn,
  CopyBtnIcon
} from './AddressTable';

const LEDGER_LIVE_PATH = "44'/60'/0'";
const LEDGER_LEGACY_PATH = "44'/60'/0'/0";
const DEFAULT_ACCOUNTS_PER_PAGE = 5;

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

const onConfirm = async (maker, address, path, closeModal, navigation) => {
  await maker.addAccount({
    address: address,
    type: AccountTypes.LEDGER,
    legacy: true,
    path
  });
  maker.useAccountWithAddress(address);

  const connectedAddress = maker.currentAddress();

  mixpanelIdentify(connectedAddress, AccountTypes.LEDGER);

  const { network } = (await navigation.getRoute()).url.query;

  const addressToView = connectedAddress;

  navigation.navigate({
    pathname: `owner/${addressToView}`,
    search: `?network=${network}`
  });
  closeModal();
};

function LedgerAddresses({ onClose, isLedgerLive }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const { maker } = useMaker();
  const { showSimpleByType } = useModal();
  const path = isLedgerLive ? LEDGER_LIVE_PATH : LEDGER_LEGACY_PATH;
  const navigation = useNavigation();

  const walletAddresses = useMakerState(maker =>
    maker.addAccount({
      type: AccountTypes.LEDGER,
      path,
      accountsOffset: 0,
      accountsLength: DEFAULT_ACCOUNTS_PER_PAGE,
      choose: addresses => {
        const addressBalancePromises = addresses.map(address =>
          addMkrAndEthBalance({
            address,
            type: AccountTypes.LEDGER
          })
        );
        return Promise.all(addressBalancePromises).then(addressBalances =>
          setAddresses(addressBalances)
        );
      }
    })
  );

  useEffect(() => {
    walletAddresses.prefetch();
  });

  return (
    <Grid gridRowGap="s" p="m">
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
            {addresses.map(({ address, ethBalance, mkrBalance }, index) => (
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
        <Button
          variant="secondary-outline"
          onClick={() => showSimpleByType('ledgertype')}
        >
          Change wallet
        </Button>
        <Button
          disabled={!selectedAddress}
          onClick={async () => {
            onConfirm(maker, selectedAddress, path, onClose, navigation);
          }}
        >
          Confirm wallet
        </Button>
      </Grid>
    </Grid>
  );
}

export default LedgerAddresses;
