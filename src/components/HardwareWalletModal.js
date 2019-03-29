import React, { useState } from 'react';

import { Button, Grid, Flex, Box } from '@makerdao/ui-components-core';
import styled from 'styled-components';

import { cutMiddle, copyToClipboard } from '../utils/ui';
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

function HardwareWalletModal({ addressList, closeModal, confirmAddress }) {
  const [selectedAddress, setSelectedAddress] = useState('');
  return (
    <>
      <Flex justifyContent="flex-end">
        <Box onClick={closeModal}>Close</Box>
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
        <Button variant="secondary-outline" onClick={closeModal}>
          Change wallet
        </Button>
        <Button
          disabled={!selectedAddress}
          onClick={() => confirmAddress(selectedAddress)}
        >
          Confirm wallet
        </Button>
      </Grid>
    </>
  );
}

export default HardwareWalletModal;
