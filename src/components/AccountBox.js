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
import useSidebar from 'hooks/useSidebar';
import useLanguage from 'hooks/useLanguage';
import { getAllFeeds } from 'reducers/feeds';
import { tokensWithBalances } from 'reducers/accounts';
import { prettifyNumber } from 'utils/ui';
import { Toggles } from 'utils/constants';
import useToggle from 'hooks/useToggle';
import styled from 'styled-components';
import Carat from './Carat';

const StyledCardBody = styled(CardBody)`
  cursor: pointer;
`;

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

const WalletBalances = ({ hasActiveAccount }) => {
  const { lang } = useLanguage();
  const balances = useWalletBalances();
  const [{ feeds }] = useStore();
  const { show: showSidebar } = useSidebar();
  const { toggle: collapsed, setToggle: setCollapsed } = useToggle(
    Toggles.WALLETBALANCES,
    true
  );
  const uniqueFeeds = useMemo(
    () =>
      getAllFeeds(feeds).reduce((acc, feed) => {
        const [token] = feed.pair.split('/');
        acc[token] = feed.value;
        return acc;
      }, {}),
    [feeds]
  );

  const showSendSidebar = props =>
    hasActiveAccount && showSidebar({ type: 'send', props });

  const tokenBalances = useMemo(
    () =>
      tokensWithBalances.reduceRight((acc, token) => {
        const balanceGtZero = !!(balances[token] && balances[token].gt(0));
        if (token !== 'ETH' && token !== 'MDAI' && !balanceGtZero) return acc;
        const symbol =
          token === 'MDAI'
            ? 'DAI'
            : token === 'DAI'
            ? 'SAI'
            : token === 'MWETH'
            ? 'WETH'
            : token;

        const tokenIsDai = token === 'MDAI' || token === 'DAI';

        const usdRatio = tokenIsDai
          ? new BigNumber(1)
          : token === 'MWETH'
          ? uniqueFeeds['ETH']
          : uniqueFeeds[token];
        return [
          {
            token,
            amount: balances[token],
            symbol,
            usdRatio
          },
          ...acc
        ];
      }, []),
    [balances, uniqueFeeds]
  );

  return (
    <>
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
          {tokenBalances.map(
            ({ token, amount, symbol, usdRatio }, idx) =>
              (!collapsed || idx < 4) && (
                <TokenBalance
                  key={`tokenbalance_${idx}`}
                  symbol={symbol}
                  amount={amount}
                  usdRatio={usdRatio}
                  button={
                    hasActiveAccount &&
                    ((token === 'SAI' && (
                      <ActionButton>{lang.sidebar.migrate}</ActionButton>
                    )) || (
                      <ActionButton onClick={() => showSendSidebar({ token })}>
                        {lang.sidebar.send}
                      </ActionButton>
                    ))
                  }
                />
              )
          )}
        </StripedRows>
      </CardBody>
      {tokenBalances.length > 3 && (
        <StyledCardBody p="s" onClick={() => setCollapsed(!collapsed)}>
          <Flex justifyContent="center" alignItems="center">
            {collapsed ? (
              <>
                <Text pr="xs">{lang.sidebar.view_more}</Text>
                <Carat />
              </>
            ) : (
              <>
                <Text pr="xs">{lang.sidebar.view_less}</Text>
                <Carat rotation={180} />
              </>
            )}
          </Flex>
        </StyledCardBody>
      )}
    </>
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
      <WalletBalances hasActiveAccount={!!currentAccount} />
    </Card>
  );
}

export default AccountBox;
