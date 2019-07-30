import React from 'react';
import { Box, Flex, Text, Card } from '@makerdao/ui-components-core';

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
        <Card p="s">
          <Text t="body" color="steel">
            MetaMask 0x...32PD
          </Text>
        </Card>
      </Flex>
    </Box>
  );
};

export default Subheader;
