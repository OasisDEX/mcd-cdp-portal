import React, { Fragment } from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import CDPList from 'components/CDPList';
import { Flex, Text } from '@makerdao/ui-components-core';
import { ReactComponent as BorrowIcon } from 'images/active-borrow-icon.svg';
import { Routes } from '../utils/constants';
import lang from 'languages';
import styled from 'styled-components';
import CDPDropdown from './CDPDropdown';

const StyledBorrowIcon = styled(BorrowIcon)`
  path {
    stroke: ${props => props.textcolor};
    fill: ${props => props.textcolor};
  }
`;

const BorrowNav = ({ viewedAddress, account, mobile, ...props }) => {
  const { url } = useCurrentRoute();
  const selected = url.pathname.startsWith(`/${Routes.BORROW}`);

  const address = account
    ? account.address
    : viewedAddress
    ? viewedAddress
    : null;

  const path = address
    ? `/${Routes.BORROW}/owner/${address}`
    : `/${Routes.BORROW}`;

  const textColor =
    selected && account
      ? 'white'
      : !selected && account
      ? 'gray'
      : selected && !account
      ? 'black'
      : 'gray';

  return (
    <Fragment>
      {mobile && selected ? (
        <CDPDropdown
          textcolor={textColor}
          selected={selected}
          account={account}
          {...props}
        >
          <CDPList
            mobile={mobile}
            currentPath={url.pathname}
            currentQuery={url.search}
            viewedAddress={address}
          />
        </CDPDropdown>
      ) : (
        <Link href={path}>
          <Flex
            bg={!account && selected && 'grey.200'}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py="s"
            {...props}
          >
            <StyledBorrowIcon
              textcolor={textColor}
              selected={selected}
              connected={account}
            />
            <Text t="p6" fontWeight="bold" color={textColor}>
              {lang.navbar.borrow}
            </Text>
          </Flex>
        </Link>
      )}
      {!mobile && (
        <CDPList
          currentPath={url.pathname}
          viewedAddress={address}
          currentQuery={url.search}
        />
      )}
    </Fragment>
  );
};

export default BorrowNav;
