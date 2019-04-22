import React from 'react';
import lang from 'languages';
import { Box, Text, Card, Flex } from '@makerdao/ui-components-core';
import { prettifyNumber } from 'utils/ui';

const SidebarFeeds = ({ feeds }) => (
  <Card pt="s" css={'overflow:hidden;'}>
    <Box px="s">
      <Text t="h4">{lang.sidebar.price_feeds}</Text>
    </Box>

    <Box mt="xs">
      {feeds.map(({ pair, value }, index) => (
        <Flex
          key={`feed_${pair}`}
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          py="xs"
          px="s"
          bg={index % 2 ? 'coolGrey.100' : 'white'}
        >
          <Text color="darkLavender" fontWeight="semibold" t="smallCaps">
            {pair}
          </Text>
          <Text fontSize="1.4rem" color="darkPurple">
            {prettifyNumber(value)}
          </Text>
        </Flex>
      ))}
    </Box>
  </Card>
);

export default SidebarFeeds;
