import React, { Fragment } from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import CDPList from 'components/CDPList';
import { Flex, Text } from '@makerdao/ui-components-core';
import { ReactComponent as BorrowIcon } from 'images/active-borrow-icon.svg';
import { Routes } from '../utils/constants';
import lang from 'languages';
import styled from 'styled-components';

const StyledBorrowIcon = styled(BorrowIcon)`
  path {
    stroke: ${props => props.textcolor};
    fill: ${props => props.textcolor};
  }
`;

const BorrowNav = ({ viewedAddress, account }) => {
  const { url } = useCurrentRoute();
  const selected = url.pathname.startsWith(`/${Routes.BORROW}`);
  const path =
    account && account.address
      ? `/${Routes.BORROW}/owner/${account.address}`
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
      <Link href={path}>
        <Flex
          bg={!account && selected && 'grey.200'}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py="s"
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
      <CDPList
        currentPath={url.pathname}
        viewedAddress={viewedAddress}
        currentQuery={url.search}
      />
    </Fragment>
  );
};

export default BorrowNav;
