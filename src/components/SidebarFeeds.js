import React from 'react';
import lang from 'languages';
import { Box, Text, Card, Flex } from '@makerdao/ui-components-core';
import { prettifyNumber } from 'utils/ui';

const SidebarFeeds = ({ feeds }) => (
  <Card pt="s">
    <Box px="s">
      <Text t="headingS" fontWeight="medium" color="heading">
        {lang.sidebar.price_feeds}
      </Text>
    </Box>

    <Box>
      {feeds.map(({ pair, value }, index) => (
        <Flex
          key={`feed_${pair}`}
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          py="xs"
          px="s"
          bg={index % 2 ? 'grayLight5' : 'white'}
        >
          <Text t="smallCaps" fontWeight="bold" color="black4">
            {pair}
          </Text>
          <Text t="p5" fontWeight="normal">
            {prettifyNumber(value)}
          </Text>
        </Flex>
      ))}
    </Box>
  </Card>
);

export default SidebarFeeds;
