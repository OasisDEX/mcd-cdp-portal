import React, { Fragment } from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import CDPList from 'components/CDPList';
import { Flex, Grid, Box } from '@makerdao/ui-components-core';
import { ReactComponent as BorrowIcon } from 'images/active-borrow-icon.svg';
import useMaker from 'hooks/useMaker';
import { Routes } from '../utils/constants';

const BorrowNav = ({ viewedAddress }) => {
  const { url } = useCurrentRoute();
  const { account } = useMaker();
  return (
    <Fragment>
      {account && (
        <Link href={`/${Routes.BORROW}/owner/${account.address}`}>
          <Flex alignItems="center" justifyContent="center" py="s">
            <BorrowIcon />
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
