import React, { useState, useCallback } from 'react';
import {
  Box,
  Table,
  Text,
  Card,
  CardBody,
  Button
} from '@makerdao/ui-components-core';
import { getSpace } from 'styles/theme';
import AccountConnect from './SidebarAccountConnect';
import ActiveAccount from 'components/ActiveAccount';
import WalletConnectDropdown from 'components/WalletConnectDropdown';
import lang from 'languages';

const TableRow = ({ name, balance, balanceUSD, btn }) => (
  <Table.tr>
    <Table.td>
      <Text
        fontSize="1.4rem"
        color="darkLavender"
        fontWeight="semibold"
        t="smallCaps"
      >
        {name}
      </Text>
    </Table.td>
    <Table.td>{balance}</Table.td>
    <Table.td>{balanceUSD}</Table.td>
    <Table.td>{btn}</Table.td>
  </Table.tr>
);

const SendTknButton = () => (
  <Button variant="secondary-outline" px="4px" py="1px">
    <Text t="smallCaps">{lang.sidebar.send}</Text>
  </Button>
);

function AccountBox({ currentAccount }) {
  const [open, setOpen] = useState(false);
  const toggleDropdown = useCallback(() => setOpen(!open), [open, setOpen]);
  const closeDropdown = useCallback(() => setOpen(false), [setOpen]);

  return (
    <Card>
      <CardBody p="s">
        <WalletConnectDropdown
          show={open}
          offset={`-${getSpace('s') + 1}, 0`}
          openOnHover={false}
          onClick={toggleDropdown}
          close={closeDropdown}
          trigger={
            currentAccount ? (
              <ActiveAccount currentAccount={currentAccount} />
            ) : (
              <AccountConnect />
            )
          }
        />
      </CardBody>
      <CardBody p="m">
        <Box pb="m">
          <Text t="h4">{lang.sidebar.wallet_balances}</Text>
        </Box>
        <Table width="100%">
          <Table.thead>
            <Table.th width="30%">{lang.sidebar.asset}</Table.th>
            <Table.th width="30%">{lang.sidebar.balance}</Table.th>
            <Table.th width="30%">{lang.sidebar.usd}</Table.th>
            <Table.th width="10%" />
          </Table.thead>
          <tbody>
            <TableRow
              name="DAI"
              balance="--"
              balanceUSD="--"
              btn={<SendTknButton />}
            />
            <TableRow
              name="MKR"
              balance="--"
              balanceUSD="--"
              btn={<SendTknButton />}
            />
            <TableRow
              name="ETH"
              balance="--"
              balanceUSD="--"
              btn={<SendTknButton />}
            />
            <TableRow
              name="OMG"
              balance="--"
              balanceUSD="--"
              btn={<SendTknButton />}
            />
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}

export default AccountBox;
