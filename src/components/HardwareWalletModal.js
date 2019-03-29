import React, { useState, useEffect } from 'react';

import { Button, Grid, Flex, Box } from '@makerdao/ui-components-core';
import styled from 'styled-components';

import { addMkrAndEthBalance } from '../utils/ethereum';
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

const computeAddressBalances = async addresses =>
  await Promise.all(
    addresses.map(address =>
      addMkrAndEthBalance({
        address
      })
    )
  );

const DEFAULT_ACCOUNT_OFFSET = 5;

const calcPaginatedAddresses = (addresses, pageNumber) => {
  const firstAddressIndex = pageNumber * DEFAULT_ACCOUNT_OFFSET;
  const lastAddressIndex = firstAddressIndex + DEFAULT_ACCOUNT_OFFSET;
  return addresses.slice(firstAddressIndex, lastAddressIndex);
};

function HardwareWalletModal({ addressList, closeModal, confirmAddress }) {
  const [totalAddresses, setTotalAddresses] = useState(addressList);
  const [pageNumber, setPageNumber] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paginatedAddresses, setPaginatedAddresses] = useState(
    calcPaginatedAddresses(totalAddresses, pageNumber)
  );
  const [renderedAddresses, setRenderedAddresses] = useState({});

  useEffect(() => {
    computeAddressBalances(paginatedAddresses).then(addresses =>
      setRenderedAddresses(addresses)
    );
  }, [paginatedAddresses]);

  useEffect(() => {
    if (addressList.length + 1 - pageNumber * DEFAULT_ACCOUNT_OFFSET <= 0) {
      // make request for more addresses
    }
    const newAddresses = calcPaginatedAddresses(totalAddresses, pageNumber);
    setPaginatedAddresses(newAddresses);
  }, [addressList, pageNumber]);

  return (
    !!renderedAddresses.length && (
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
        <Grid
          gridRowGap="xs"
          gridColumnGap="s"
          gridTemplateColumns={['1fr', 'auto auto']}
          justifySelf={['stretch', 'center']}
        >
          <Button
            disabled={pageNumber === 0}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            &#60;
          </Button>
          <Button
            disabled={
              (pageNumber + 1) * DEFAULT_ACCOUNT_OFFSET >= totalAddresses.length
            }
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            &#62;
          </Button>
        </Grid>
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
              {renderedAddresses.map(
                ({ address, ethBalance, mkrBalance }, index) => (
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
                    <td>{pageNumber * DEFAULT_ACCOUNT_OFFSET + (index + 1)}</td>
                    <InlineTd title={address}>
                      {cutMiddle(address, 7, 5)}
                      <CopyBtn onClick={() => copyToClipboard(address)}>
                        <CopyBtnIcon />
                      </CopyBtn>
                    </InlineTd>
                    {<td>{ethBalance} ETH</td>}
                    <td>{mkrBalance} MKR</td>
                  </tr>
                )
              )}
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
    )
  );
}

export default HardwareWalletModal;
