import React, { useState, useCallback } from 'react';
import {
  Box,
  Text,
  Card,
  CardBody,
  Button,
  Flex
} from '@makerdao/ui-components-core';
import { getSpace } from 'styles/theme';
import ActiveAccount from 'components/ActiveAccount';
import WalletConnectDropdown from 'components/WalletConnectDropdown';
import lang from 'languages';

const SendTknButton = () => (
  <Button variant="secondary-outline" px="4px" py="1px">
    <Text t="smallCaps">{lang.sidebar.send}</Text>
  </Button>
);

const mockWalletBalances = [
  {
    asset: 'DAI',
    balance: '--',
    balanceUSD: '--',
    btn: <SendTknButton />
  },
  {
    asset: 'MKR',
    balance: '--',
    balanceUSD: '--',
    btn: <SendTknButton />
  },
  {
    asset: 'ETH',
    balance: '--',
    balanceUSD: '--',
    btn: <SendTknButton />
  },
  {
    asset: 'OMG',
    balance: '--',
    balanceUSD: '--',
    btn: <SendTknButton />
  }
];

function AccountBox({ currentAccount }) {
  const [open, setOpen] = useState(false);
  const toggleDropdown = useCallback(() => setOpen(!open), [open, setOpen]);
  const closeDropdown = useCallback(() => setOpen(false), [setOpen]);
  const address = currentAccount ? currentAccount.address : null;
  const type = currentAccount ? currentAccount.type : null;

  return (
    <Card>
      <CardBody p="s">
        <WalletConnectDropdown
          show={open}
          offset={`-${getSpace('s') + 1}, 0`}
          openOnHover={false}
          onClick={toggleDropdown}
          close={closeDropdown}
          trigger={<ActiveAccount address={address} type={type} />}
        />
      </CardBody>

      <CardBody>
        <Box px="s" py="m">
          <Text t="h4">{lang.sidebar.wallet_balances}</Text>
        </Box>

        <Flex justifyContent="space-between" px="s">
          <Text color="steel" fontWeight="semibold" t="smallCaps" width="20%">
            {lang.sidebar.asset}
          </Text>
          <Text color="steel" fontWeight="semibold" t="smallCaps" width="30%">
            {lang.sidebar.balance}
          </Text>
          <Text color="steel" fontWeight="semibold" t="smallCaps" width="30%">
            {lang.sidebar.usd}
          </Text>
          <Text color="steel" fontWeight="semibold" t="smallCaps" width="20%">
            {''}
          </Text>
        </Flex>
        {mockWalletBalances.map(({ asset, balance, balanceUSD, btn }, idx) => (
          <Flex
            key={`wb_${asset}_${idx}`}
            justifyContent="space-between"
            alignItems="center"
            bg={idx % 2 ? 'coolGrey.100' : 'white'}
            px="s"
            py="xs"
          >
            <Text
              color="darkLavender"
              fontWeight="semibold"
              t="p5"
              textAlign="left"
              width="20%"
            >
              {asset}
            </Text>
            <Text
              color="darkLavender"
              fontWeight="semibold"
              t="p5"
              textAlign="left"
              width="30%"
            >
              {balance}
            </Text>
            <Text
              color="darkLavender"
              fontWeight="semibold"
              t="p5"
              textAlign="left"
              width="30%"
            >
              {balanceUSD}
            </Text>
            {btn}
          </Flex>
        ))}
      </CardBody>
    </Card>
  );
}

export default AccountBox;
