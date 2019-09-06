import React from 'react';
import { Link, useCurrentRoute } from 'react-navi';
import { Flex, Text } from '@makerdao/ui-components-core';
import { ReactComponent as SaveIcon } from 'images/active-save-icon.svg';
import { Routes } from '../utils/constants';
import lang from 'languages';
import styled from 'styled-components';

const StyledSaveIcon = styled(SaveIcon)`
  path {
    stroke: ${props => (props.active ? 'white' : 'gray')};
  }
`;

const SaveNav = () => {
  const { url } = useCurrentRoute();
  const active = url.pathname.startsWith(`/${Routes.SAVE}`);
  return (
    <Link href={`/${Routes.SAVE}`}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py="s"
      >
        <StyledSaveIcon active={active} />
        <Text t="p6" fontWeight="bold" color={active ? 'white' : 'gray'}>
          {lang.navbar.save}
        </Text>
      </Flex>
    </Link>
  );
};

export default SaveNav;
