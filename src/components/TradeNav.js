import React from 'react';
import { Link } from 'react-navi';
import styled from 'styled-components';
import { Flex, Text } from '@makerdao/ui-components-core';
import { ReactComponent as TradeIcon } from 'images/active-trade-icon.svg';
import { Routes } from '../utils/constants';
import useLanguage from 'hooks/useLanguage';

const StyledTradeIcon = styled(TradeIcon)`
  circle {
    stroke: ${props => (props.active ? 'white' : 'gray')};
  }
`;

const TradeNav = ({ ...props }) => {
  const { lang } = useLanguage();
  return (
    <Link href={`/${Routes.TRADE}`} target="_blank">
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py="s"
        {...props}
      >
        <StyledTradeIcon />
        <Text t="p6" fontWeight="bold" color={'gray'}>
          {lang.navbar.trade}
        </Text>
      </Flex>
    </Link>
  );
};

export default TradeNav;
