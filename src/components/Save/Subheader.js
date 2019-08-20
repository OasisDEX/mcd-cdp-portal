import React from 'react';
import { Box, Flex, Text } from '@makerdao/ui-components-core';
import { Link } from 'react-navi';
import { Routes } from '../../utils/constants';

const Subheader = () => {
  return (
    <Box borderTop="default" p="s">
      <Flex
        maxWidth="1090px"
        m="0 auto"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text t="h5">Savings Dai</Text>
        <Flex
          p="xs"
          border="1px solid lightgray"
          borderRadius="3px"
          width="200px"
        >
          <Link href={`/${Routes.BORROW}`}>
            <Text fontSize="1.2rem" color="lightgray">
              {'> /borrow'}
            </Text>
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Subheader;
