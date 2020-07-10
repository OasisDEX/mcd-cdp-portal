import React from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import styled from 'styled-components';
import { Flex, Text } from '@makerdao/ui-components-core';

import { ReactComponent as ArbIcon } from 'images/arbitrage.svg';
import { Routes } from '../utils/constants';
import useLanguage from 'hooks/useLanguage';

const StyledArbIcon = styled(ArbIcon)`
  path {
    stroke: ${props => props.textcolor};
    fill: ${props => props.textcolor};
  }
`;

const ArbNav = ({ account, ...props }) => {
  const { lang } = useLanguage();
  const { url } = useCurrentRoute();
  const selected = url.pathname.startsWith(`/${Routes.ARBITRAGE}`);

  const textColor =
    selected && account
      ? 'white'
      : !selected && account
      ? 'gray'
      : selected && !account
      ? 'black'
      : 'gray';

  const arbUrl = account?.address
    ? `/${Routes.ARBITRAGE}/owner/${account?.address}${url.search}`
    : `/${Routes.ARBITRAGE}${url.search}`;

  return (
    <Link href={arbUrl}>
      <Flex
        bg={!account && selected && 'grey.200'}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py="s"
        {...props}
      >
        <StyledArbIcon
          textcolor={textColor}
          selected={selected}
          connected={account}
        />
        <Text t="p6" fontWeight="bold" color={textColor}>
          {lang.navbar.arbitrage}
        </Text>
      </Flex>
    </Link>
  );
};

export default ArbNav;
