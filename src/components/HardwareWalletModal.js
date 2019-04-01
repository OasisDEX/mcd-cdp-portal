import React, { useState, useEffect } from 'react';

import { Button, Grid, Flex, Text, Box } from '@makerdao/ui-components-core';
import styled from 'styled-components';
import Loader from './Loader';
import { addMkrAndEthBalance } from '../utils/ethereum';
import { cutMiddle, copyToClipboard } from '../utils/ui';
import {
  AddressContainer,
  Table,
  InlineTd,
  CopyBtn,
  CopyBtnIcon
} from './AddressTable';

export const StyledTitle = styled.div`
  font-weight: bold;
  color: #212536;
  line-height: 22px;
  font-size: 28px;
`;

export const StyledBlurb = styled.div`
  line-height: 22px;
  font-size: 17px;
`;

const computeAddressBalances = addresses =>
  Promise.all(
    addresses.map(address =>
      addMkrAndEthBalance({
        address
      })
    )
  );

const numAddrToDisplay = 5;

const calcPaginatedAddresses = (addresses, pageNumber) => {
  const firstAddressIndex = pageNumber * numAddrToDisplay;
  const lastAddressIndex = firstAddressIndex + numAddrToDisplay;
  return addresses.slice(firstAddressIndex, lastAddressIndex);
};

function HardwareWalletModal({
  addressList,
  closeModal,
  fetchAccounts,
  confirmAddress
}) {
  const [totalAddresses, setTotalAddresses] = useState(addressList);
  const [pageNumber, setPageNumber] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paginatedAddresses, setPaginatedAddresses] = useState(
    calcPaginatedAddresses(totalAddresses, pageNumber)
  );
  const [renderedAddresses, setRenderedAddresses] = useState({});
  const [accOffset, setAccOffset] = useState(1);

  useEffect(() => {
    computeAddressBalances(paginatedAddresses).then(addresses =>
      setRenderedAddresses(addresses)
    );
  }, [paginatedAddresses]);

  useEffect(() => {
    if (totalAddresses.length - pageNumber * numAddrToDisplay <= 0) {
      setRenderedAddresses({});
      fetchAccounts(accOffset).then(moreAddresses => {
        setAccOffset(accOffset + 1);
        setTotalAddresses(totalAddresses.concat(moreAddresses));
      });
    }
    const newAddresses = calcPaginatedAddresses(totalAddresses, pageNumber);
    setPaginatedAddresses(newAddresses);
  }, [totalAddresses, pageNumber]);

  return !renderedAddresses.length ? (
    <Loader size={50} />
  ) : (
    <Grid gridRowGap="xs">
      <Box>
        <Flex justifyContent="flex-end">
          <Box onClick={closeModal}>Close</Box>
        </Flex>
        <Flex justifyContent="center">
          <StyledTitle>Select address</StyledTitle>
        </Flex>
      </Box>
      <Box m="m" textAlign="center">
        <Text fontSize="1.8rem">
          Please select which address you would like to open
        </Text>
      </Box>

      <Grid
        width="100%"
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
        <Button onClick={() => setPageNumber(pageNumber + 1)}>&#62;</Button>
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
                  <td>{pageNumber * numAddrToDisplay + (index + 1)}</td>
                  <InlineTd title={address}>
                    {cutMiddle(address, 7, 5)}
                    <CopyBtn onClick={() => copyToClipboard(address)}>
                      <CopyBtnIcon />
                    </CopyBtn>
                  </InlineTd>
                  <td>{ethBalance} ETH</td>
                  <td>{mkrBalance} MKR</td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </AddressContainer>
      <Grid
        width="100%"
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
    </Grid>
  );
}

export default HardwareWalletModal;
