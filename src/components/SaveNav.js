import React from 'react';
import { Link } from 'react-navi';
import { Flex, Text } from '@makerdao/ui-components-core';
import { ReactComponent as SaveIcon } from 'images/active-save-icon.svg';
import { Routes } from '../utils/constants';
import lang from 'languages';

const SaveNav = () => {
  return (
    <Link href={`/${Routes.SAVE}`}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py="s"
      >
        <SaveIcon />
        <Text t="p6" fontWeight="bold" color={'white'}>
          {lang.navbar.save}
        </Text>
      </Flex>
    </Link>
  );
};

export default SaveNav;
