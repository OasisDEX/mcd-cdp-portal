import React, { Fragment } from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import CDPList from 'components/CDPList';
import { Flex, Text } from '@makerdao/ui-components-core';
import { ReactComponent as BorrowIcon } from 'images/active-borrow-icon.svg';
import useMaker from 'hooks/useMaker';
import { Routes } from '../utils/constants';
import lang from 'languages';

const BorrowNav = ({ viewedAddress }) => {
  const { url } = useCurrentRoute();
  const { account } = useMaker();
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
            <BorrowIcon />
            <Text t="p6" fontWeight="bold" color={'white'}>
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
