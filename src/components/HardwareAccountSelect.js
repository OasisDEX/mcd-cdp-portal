import React, { useEffect, useCallback, useState } from 'react';

import {
  Button,
  Grid,
  Flex,
  Text,
  Box,
  Table,
  Loader
} from '@makerdao/ui-components-core';
import useHardwareWallet from 'hooks/useHardwareWallet';
import { cutMiddle, copyToClipboard } from 'utils/ui';
import { getColor } from 'styles/theme';
import { CopyBtn, CopyBtnIcon } from './AddressTable';
import { ReactComponent as Cross } from 'images/cross.svg';

const ACCOUNTS_PER_PAGE = 5;
const ACCOUNTS_TO_FETCH = 25;

function HardwareAccountSelect({ type, path, onClose, confirmAddress }) {
  const [page, setPage] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { fetch, connect, accounts, pickAccount, fetching } = useHardwareWallet(
    { type, accountsLength: ACCOUNTS_TO_FETCH, path }
  );

  useEffect(() => {
    connect().then(address => {
      confirmAddress(address);
      onClose();
    }, onClose);
  }, [confirmAddress, onClose]);

  const toPage = useCallback(
    async page => {
      if (accounts.length - page * ACCOUNTS_PER_PAGE <= 0) {
        const offset = accounts.length / (page * ACCOUNTS_PER_PAGE);
        await fetch({ offset });
      }
      setPage(page);
    },
    [accounts, fetch]
  );

  const selectAddress = useCallback(
    address => {
      setSelectedAddress(address);
    },
    [setSelectedAddress]
  );

  const onConfirm = useCallback(() => {
    pickAccount(selectedAddress);
  }, [pickAccount, selectedAddress]);

  const start = page * ACCOUNTS_PER_PAGE;
  const renderedAccounts = accounts.slice(start, start + ACCOUNTS_PER_PAGE);

  return !renderedAccounts.length ? (
    <Loader size="5rem" color={getColor('makerTeal')} />
  ) : (
    <Grid gridRowGap="m" width={['100%', '53rem']}>
      <Flex justifyContent="flex-end">
        <Cross css={{ cursor: 'pointer' }} onClick={onClose} />
      </Flex>
      <Grid gridRowGap="s">
        <Text.h3 textAlign="center">Select address</Text.h3>
        <Text.p t="body" fontSize="1.8rem" textAlign="center">
          Please select which address you would like to open
        </Text.p>
      </Grid>

      <Grid
        width="100%"
        gridColumnGap="s"
        gridRowGap="s"
        gridTemplateColumns="auto auto"
      >
        <Button
          variant="secondary-outline"
          disabled={page === 0 || fetching}
          onClick={() => toPage(page - 1)}
        >
          &#60;
        </Button>
        <Button
          variant="secondary-outline"
          disabled={fetching}
          onClick={() => toPage(page + 1)}
        >
          &#62;
        </Button>
      </Grid>
      <div>
        <Table width="100%" opacity={fetching ? 0.6 : 1}>
          <thead>
            <tr>
              <th css={{ textAlign: 'center' }}>Select</th>
              <th>
                <Box pr="m" textAlign="center">
                  #
                </Box>
              </th>
              <th>Address</th>
              <th>ETH</th>
              <th>MKR</th>
            </tr>
          </thead>
          <tbody>
            {renderedAccounts.map(
              ({ address, ethBalance, mkrBalance }, index) => (
                <tr key={address}>
                  <td>
                    <Flex justifyContent="center">
                      <input
                        type="radio"
                        name="address"
                        value={index}
                        checked={address === selectedAddress}
                        onChange={() => selectAddress(address)}
                      />
                    </Flex>
                  </td>
                  <td>
                    <Box pr="m" textAlign="center">
                      {page * ACCOUNTS_PER_PAGE + (index + 1)}
                    </Box>
                  </td>
                  <td>
                    <Flex alignItems="center">
                      {cutMiddle(address, 7, 5)}
                      <CopyBtn onClick={() => copyToClipboard(address)}>
                        <CopyBtnIcon />
                      </CopyBtn>
                    </Flex>
                  </td>
                  <td>{ethBalance} ETH</td>
                  <td>{mkrBalance} MKR</td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </div>
      <Grid
        width="100%"
        gridRowGap="xs"
        gridColumnGap="s"
        gridTemplateColumns={['1fr', 'auto auto']}
        justifyContent="center"
        justifySelf={['stretch', 'center']}
      >
        <Button variant="secondary-outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={!selectedAddress} onClick={onConfirm}>
          Confirm
        </Button>
      </Grid>
    </Grid>
  );
}

export default HardwareAccountSelect;
