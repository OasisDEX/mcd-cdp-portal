import React from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import { Flex, Grid, Box } from '@makerdao/ui-components-core';
import { ReactComponent as TradeIcon } from 'images/active-trade-icon.svg';
import useMaker from 'hooks/useMaker';
import { Routes } from '../utils/constants';

const TradeNav = () => {
  return (
    <Link href={`/${Routes.TRADE}`}>
      <Flex alignItems="center" justifyContent="center" py="s">
        <TradeIcon />
      </Flex>
    </Link>
  );
};

export default TradeNav;
