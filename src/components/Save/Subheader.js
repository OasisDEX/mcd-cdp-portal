import React from 'react';
import { Box, Flex, Text } from '@makerdao/ui-components-core';
import AccountBox from '../../components/AccountBox';
import useMaker from '../../hooks/useMaker';

const Subheader = () => {
  const { account } = useMaker();
  return (
    <Box borderTop="default" p="s">
      <Flex
        maxWidth="1090px"
        m="0 auto"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text t="h5">Savings Dai</Text>
        <Box width="300px">
          <AccountBox currentAccount={account} />
        </Box>
      </Flex>
    </Box>
  );
};

export default Subheader;
