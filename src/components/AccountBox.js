import React, { useState, useCallback } from 'react';
import {
  Box,
  Text,
  Card,
  CardBody,
  Button,
  Flex
} from '@makerdao/ui-components-core';
import ilkList from 'references/ilkList';
import { getSpace } from 'styles/theme';
import ActiveAccount from 'components/ActiveAccount';
import StripedRows from 'components/StripedRows';
import WalletConnectDropdown from 'components/WalletConnectDropdown';
import useWalletBalances from 'hooks/useWalletBalances';
import lang from 'languages';

let uniqueGemsToShow = new Set(ilkList.map(ilk => ilk.gem));
// we handle showing ETH manually since we always want to show it first
uniqueGemsToShow.delete('ETH');
uniqueGemsToShow = [...uniqueGemsToShow];

const SendTknButton = () => (
  <Button variant="secondary-outline" px="4px" py="1px">
    <Text t="smallCaps">{lang.sidebar.send}</Text>
  </Button>
);

const TokenBalance = ({ symbol, currencyAmount, button }) => {
  return (
    <Flex
      key={`wb_${symbol}`}
      justifyContent="space-between"
      alignItems="center"
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
        {symbol}
      </Text>
      <Text
        color="darkLavender"
        fontWeight="semibold"
        t="p5"
        textAlign="left"
        width="30%"
      >
        {(currencyAmount && currencyAmount.toBigNumber().toFixed(3)) || '--'}
      </Text>
      <Text
        color="darkLavender"
        fontWeight="semibold"
        t="p5"
        textAlign="left"
        width="30%"
      >
        --
      </Text>
      <Flex width="20%" justifyContent="flex-end">
        {button}
      </Flex>
    </Flex>
  );
};

const WalletBalances = () => {
  const balances = useWalletBalances();

  const balanceETH = balances.ETH && balances.ETH.balance;

  return (
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
        <Box width="20%" />
      </Flex>

      <StripedRows>
        <TokenBalance
          symbol="DAI"
          currencyAmount={balances.MDAI && balances.MDAI.balance}
          button={<SendTknButton />}
        />
        {balanceETH && balanceETH.gt(0) && (
          <TokenBalance
            symbol="WETH"
            currencyAmount={balanceETH}
            button={<SendTknButton />}
          />
        )}

        {uniqueGemsToShow.map(gem => {
          const balance = balances[gem] && balances[gem].balance;
          return (
            balance &&
            balance.toBigNumber().gt(0) && (
              <TokenBalance
                symbol={gem}
                currencyAmount={balance}
                button={<SendTknButton />}
              />
            )
          );
        })}
      </StripedRows>
    </CardBody>
  );
};

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
      <WalletBalances />
    </Card>
  );
}

export default AccountBox;
