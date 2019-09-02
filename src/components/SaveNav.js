import React from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import CDPList from 'components/CDPList';
import { Flex, Grid, Box } from '@makerdao/ui-components-core';
import { ReactComponent as SaveIcon } from 'images/active-save-icon.svg';
import useMaker from 'hooks/useMaker';
import { Routes } from '../utils/constants';

const SaveNav = () => {
  return (
    <Link href={`/${Routes.SAVE}`}>
      <Flex alignItems="center" justifyContent="center" py="s">
        <SaveIcon />
      </Flex>
    </Link>
  );
};

export default SaveNav;
