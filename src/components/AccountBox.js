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
import { getSpace } from 'styles/theme';
import ActiveAccount from 'components/ActiveAccount';
import StripedRows from 'components/StripedRows';
import WalletConnectDropdown from 'components/WalletConnectDropdown';
import useWalletBalances from 'hooks/useWalletBalances';
import useSidebar from 'hooks/useSidebar';
import useLanguage from 'hooks/useLanguage';
import { showWalletTokens } from 'references/config';
import { prettifyNumber } from 'utils/ui';
import { Toggles } from 'utils/constants';
import useToggle from 'hooks/useToggle';
import useAnalytics from 'hooks/useAnalytics';
import styled from 'styled-components';
import Carat from './Carat';
import { Link, useCurrentRoute } from 'react-navi';
import { Routes } from 'utils/constants';
import theme from '../styles/theme';
import FullScreenAction from './CDPDisplay/FullScreenAction';
import useCdpTypes from '../hooks/useCdpTypes';
import { watch } from 'hooks/useObservable';

const migrateUrl = 'https://oasis.app/trade/account';

const StyledCardBody = styled(CardBody)`
  cursor: pointer;
`;

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

const TokenBalance = ({
  symbol,
  amount,
  usdRatio,
  button,
  hasActiveAccount,
  ...props
}) => {
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
        {(hasActiveAccount && amount && prettifyNumber(amount, true)) || '--'}
      </Text>
      <Text
        color="darkLavender"
        fontWeight="semibold"
        t="p5"
        textAlign="left"
        width="30%"
      >
        {(hasActiveAccount &&
          amount &&
          usdRatio &&
          `$${prettifyNumber(amount.times(usdRatio.toNumber()), true, 2)}`) ||
          '--'}
      </Text>
      <Flex width="20%" justifyContent="flex-end">
        {button}
      </Flex>
    </Flex>
  );
};

const WalletBalances = ({ hasActiveAccount, closeSidebarDrawer }) => {
  const { lang } = useLanguage();
  const { url } = useCurrentRoute();
  const { trackBtnClick } = useAnalytics('WalletBalances');
  const [actionShown, setActionShown] = useState(null);

  const balances = useWalletBalances();

  const { show: showSidebar } = useSidebar();
  const { toggle: collapsed, setToggle: setCollapsed } = useToggle(
    Toggles.WALLETBALANCES,
    true
  );

  const { cdpTypesList } = useCdpTypes();
  const prices = watch.collateralTypesPrices(cdpTypesList);
  const uniqueFeeds = useMemo(
    () =>
      prices
        ? prices.reduce((acc, price) => {
            const [, symbol] = price.symbol.split('/');
            acc[symbol] = price;
            return acc;
          }, {})
        : {},
    [prices]
  );

  const showAction = props => {
    const emSize = parseInt(getComputedStyle(document.body).fontSize);
    const pxBreakpoint = parseInt(theme.breakpoints.l) * emSize;
    const isMobile = document.documentElement.clientWidth < pxBreakpoint;
    if (isMobile) {
      closeSidebarDrawer();
      setActionShown(props);
    } else {
      showSidebar(props);
    }
  };

  const tokenBalances = useMemo(
    () =>
      showWalletTokens.reduceRight((acc, token) => {
        const balanceGtZero = !!(balances[token] && balances[token].gt(0));
        if (token !== 'ETH' && token !== 'DAI' && !balanceGtZero) return acc;
        const symbol = token;

        const tokenIsDaiOrDsr =
          token === 'DAI' || token === 'SAI' || token === 'DSR';
        const usdRatio = tokenIsDaiOrDsr
          ? new BigNumber(1)
          : token === 'WETH'
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
      <CardBody css={{ borderRadius: '0 0 4px 4px', overflow: 'hidden' }}>
        <Box px="s" pt="sm" pb="s2">
          <Text t="large">{lang.sidebar.wallet_balances}</Text>
        </Box>
        <Flex justifyContent="space-between" px="s" mb="4px">
          <Text color="steel" fontWeight="bold" t="smallCaps" width="20%">
            {lang.sidebar.asset}
          </Text>
          <Text color="steel" fontWeight="bold" t="smallCaps" width="30%">
            {lang.sidebar.balance}
          </Text>
          <Text color="steel" fontWeight="bold" t="smallCaps" width="30%">
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
                  hasActiveAccount={hasActiveAccount}
                  button={
                    hasActiveAccount &&
                    (symbol === 'DSR' ? (
                      <Link
                        href={`/${Routes.SAVE}${url.search}`}
                        style={{
                          visibility: url.pathname.startsWith(`/${Routes.SAVE}`)
                            ? 'hidden'
                            : 'visible'
                        }}
                      >
                        <ActionButton onClick={() => trackBtnClick('Withdraw')}>
                          {lang.actions.withdraw}
                        </ActionButton>
                      </Link>
                    ) : symbol === 'SAI' ? (
                      <ActionButton
                        onClick={() => trackBtnClick('Migrate')}
                        as="a"
                        target="_blank"
                        href={migrateUrl}
                      >
                        {lang.sidebar.migrate}
                      </ActionButton>
                    ) : (
                      <ActionButton
                        disabled={!hasActiveAccount}
                        onClick={() => {
                          trackBtnClick('Send', {
                            collateral: token
                          });
                          showAction({
                            type: 'send',
                            props: { token, trackBtnClick }
                          });
                        }}
                      >
                        {lang.sidebar.send}
                      </ActionButton>
                    ))
                  }
                />
              )
          )}
        </StripedRows>
      </CardBody>
      {tokenBalances.length > 4 && (
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
      {actionShown && (
        <FullScreenAction {...actionShown} reset={() => setActionShown(null)} />
      )}
    </>
  );
};

function AccountBox({ currentAccount, closeSidebarDrawer }) {
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
      <WalletBalances
        hasActiveAccount={!!currentAccount}
        closeSidebarDrawer={closeSidebarDrawer}
      />
    </Card>
  );
}

export default AccountBox;
