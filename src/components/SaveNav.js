import React from 'react';
import { Link } from 'react-navi';
import styled from 'styled-components';
import { Flex, Text } from '@makerdao/ui-components-core';

import { ReactComponent as SaveIcon } from 'images/active-save-icon.svg';
import useLanguage from 'hooks/useLanguage';
import useCheckRoute from 'hooks/useCheckRoute';

const StyledSaveIcon = styled(SaveIcon)`
  path {
    stroke: ${props => props.textcolor};
    fill: ${props => props.textcolor};
  }
`;

const SaveNav = ({ account, ...props }) => {
  const { lang } = useLanguage();
  const { isSave } = useCheckRoute();
  const selected = isSave;

  const textColor =
    selected && account
      ? 'white'
      : !selected && account
      ? 'gray'
      : selected && !account
      ? 'black'
      : 'gray';

  const saveUrl = 'https://oasis.app/dashboard';
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
