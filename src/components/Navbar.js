import React, { Fragment } from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import CDPList from 'components/CDPList';
import NavLogo from 'components/NavLogo';
import useMaker from 'hooks/useMaker';
import { Flex, Grid } from '@makerdao/ui-components-core';

const Navbar = ({ address }) => {
  const { maker } = useMaker();
  const { url } = useCurrentRoute();
  return (
    <Fragment>
      <Link href={`/${url.search}`} prefetch={true}>
        <Flex alignItems="center" justifyContent="center" py="m">
          <NavLogo />
        </Flex>
      </Link>
      <Grid gridRowGap="xs">
        <CDPList
          currentPath={url.pathname}
          currentQuery={url.search}
          // address={address}
          isOwner={maker.currentAddress()}
        />
      </Grid>
    </Fragment>
  );
};

export default Navbar;
