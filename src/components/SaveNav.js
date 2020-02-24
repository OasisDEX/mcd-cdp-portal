import React from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import styled from 'styled-components';
import { Flex, Text } from '@makerdao/ui-components-core';

import { ReactComponent as SaveIcon } from 'images/active-save-icon.svg';
import { Routes } from '../utils/constants';
import useLanguage from 'hooks/useLanguage';

const StyledSaveIcon = styled(SaveIcon)`
  path {
    stroke: ${props => props.textcolor};
    fill: ${props => props.textcolor};
  }
`;

const SaveNav = ({ account, ...props }) => {
  const { lang } = useLanguage();
  const { url } = useCurrentRoute();
  const selected = url.pathname.startsWith(`/${Routes.SAVE}`);

  const textColor =
    selected && account
      ? 'white'
      : !selected && account
      ? 'gray'
      : selected && !account
      ? 'black'
      : 'gray';

  const saveUrl = account?.address
    ? `/${Routes.SAVE}/owner/${account?.address}${url.search}`
    : `/${Routes.SAVE}${url.search}`;
  return (
    <Link href={saveUrl}>
      <Flex
        bg={!account && selected && 'grey.200'}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py="s"
        {...props}
      >
        <StyledSaveIcon
          textcolor={textColor}
          selected={selected}
          connected={account}
        />
        <Text t="p6" fontWeight="bold" color={textColor}>
          {lang.navbar.save}
        </Text>
      </Flex>
    </Link>
  );
};

export default SaveNav;
