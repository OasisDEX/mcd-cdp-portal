import React, { Fragment } from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import CDPList from 'components/CDPList';
import { Flex, Text } from '@makerdao/ui-components-core';
import { ReactComponent as BorrowIcon } from 'images/active-borrow-icon.svg';
import useMaker from 'hooks/useMaker';
import { Routes } from '../utils/constants';
import lang from 'languages';
import styled from 'styled-components';

const StyledBorrowIcon = styled(BorrowIcon)`
  path {
    stroke: ${props => (props.active ? 'white' : 'gray')};
  }
`;

const BorrowNav = ({ viewedAddress }) => {
  const { url } = useCurrentRoute();
  const { account } = useMaker();
  const active = url.pathname.startsWith(`/${Routes.BORROW}`);
  return (
    <Fragment>
      {account && (
        <Link href={`/${Routes.BORROW}/owner/${account.address}`}>
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py="s"
          >
            <StyledBorrowIcon active={active} />
            <Text t="p6" fontWeight="bold" color={active ? 'white' : 'gray'}>
              {lang.navbar.borrow}
            </Text>
          </Flex>
        </Link>
      )}
      <CDPList
        currentPath={url.pathname}
        viewedAddress={viewedAddress}
        currentQuery={url.search}
      />
    </Fragment>
  );
};

export default BorrowNav;
