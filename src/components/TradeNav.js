import React from 'react';
import { Link } from 'react-navi';
import { Flex, Text } from '@makerdao/ui-components-core';
import { ReactComponent as TradeIcon } from 'images/active-trade-icon.svg';
import { Routes } from '../utils/constants';
import lang from 'languages';

const TradeNav = () => {
  return (
    <Link href={`/${Routes.TRADE}`}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py="s"
      >
        <TradeIcon />
        <Text t="p6" fontWeight="bold" color={'white'}>
          {lang.navbar.trade}
        </Text>
      </Flex>
    </Link>
  );
};

export default TradeNav;
