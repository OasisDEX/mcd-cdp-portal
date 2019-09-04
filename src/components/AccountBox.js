import React, { useState, useCallback, useMemo } from 'react';
import BigNumber from 'bignumber.js';
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
import useStore from 'hooks/useStore';
import { getAllFeeds } from 'reducers/feeds';
import { prettifyNumber } from 'utils/ui';
import lang from 'languages';

let uniqueGemsToShow = new Set(ilkList.map(ilk => ilk.gem));
// this turns out to be the same as MWETH, which we show manually
uniqueGemsToShow.delete('ETH');
uniqueGemsToShow = [...uniqueGemsToShow];

const ActionButton = ({ children, ...rest }) => (
  <Button
    variant="secondary-outline"
    px="4px"
    py="1px"
    minWidth="4.5rem"
    {...rest}
  >
    <Text t="smallCaps">{children}</Text>
  </Button>
);

const TokenBalance = ({ symbol, amount, usdRatio, button, ...props }) => {
  return (
    <Flex
      key={`wb_${symbol}`}
      justifyContent="space-between"
      alignItems="center"
      px="s"
      py="xs"
      {...props}
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
        {(amount && prettifyNumber(amount, true, 3)) || '--'}
      </Text>
      <Text
        color="darkLavender"
        fontWeight="semibold"
        t="p5"
        textAlign="left"
        width="30%"
      >
        {(amount &&
          usdRatio &&
          `$${prettifyNumber(amount.times(usdRatio.toNumber()), true, 3)}`) ||
          '--'}
      </Text>
      <Flex width="20%" justifyContent="flex-end">
        {button}
      </Flex>
    </Flex>
  );
};

const WalletBalances = () => {
  const balances = useWalletBalances();
  const [{ feeds }] = useStore();
  const uniqueFeeds = useMemo(
    () =>
      getAllFeeds(feeds).reduce((acc, feed) => {
        const [token] = feed.pair.split('/');
        acc[token] = feed.value;
        return acc;
      }, {}),
    [feeds]
  );

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
          amount={balances.MDAI}
          usdRatio={new BigNumber(1)}
          button={<ActionButton>{lang.sidebar.send}</ActionButton>}
        />
        <TokenBalance
          symbol="ETH"
          amount={balances.ETH}
          usdRatio={uniqueFeeds.ETH}
          button={<ActionButton>{lang.sidebar.send}</ActionButton>}
        />
        {balances.SAI && balances.SAI.gt(0) && (
          <TokenBalance
            symbol="SAI"
            amount={balances.SAI}
            usdRatio={new BigNumber(1)}
            button={<ActionButton>{lang.sidebar.migrate}</ActionButton>}
          />
        )}
        {balances.MWETH && balances.MWETH.gt(0) && (
          <TokenBalance
            symbol="WETH"
            amount={balances.MWETH}
            usdRatio={uniqueFeeds.ETH}
            button={<ActionButton>{lang.sidebar.send}</ActionButton>}
          />
        )}

        {uniqueGemsToShow.map(gem => {
          const balance = balances[gem];
          return (
            balance &&
            balance.gt(0) && (
              <TokenBalance
                key={gem}
                symbol={gem}
                amount={balance}
                usdRatio={uniqueFeeds[gem]}
                button={<ActionButton>{lang.sidebar.send}</ActionButton>}
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
