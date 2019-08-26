import React from 'react';
import { Box, Flex, Text } from '@makerdao/ui-components-core';

const Footer = () => {
  return (
    <Box borderTop="default" mt="m">
      <Flex
        maxWidth="1090px"
        justifyContent="space-between"
        m="0 auto"
        px="s"
        py="m"
      >
        <div>
          <Text t="caption">Terms</Text> <Text t="caption">Private Policy</Text>{' '}
          <Text t="caption">Status</Text>
        </div>
        <div>
          <Text t="caption">© 2019 Maker</Text>
        </div>
      </Flex>
    </Box>
  );
};

export default Footer;
