import React from 'react';
import styled from 'styled-components';
import { Box, Text, Flex, Card } from '@makerdao/ui-components-core';
import { borderRadiuses, borders } from '@makerdao/design-system-constants';

import Tabs from './Tabs';

const TabHeaderContainer = styled(Box)`
  &:first-child {
    border-top-left-radius: ${borderRadiuses.default};
  }

  &:last-child {
    border-top-right-radius: ${borderRadiuses.default};
  }

  &:not(:last-child) {
    border-right: ${borders.default};
  }

  cursor: pointer;
`;

const TabHeader = ({ selected, children, ...props }) => {
  return (
    <TabHeaderContainer
      bg={selected ? 'white' : 'lightGrey'}
      py="m"
      flexGrow="1"
      textAlign="center"
      borderBottom={selected ? null : 'default'}
      {...props}
    >
      <Text t="h5" color={selected ? 'darkPurple' : 'darkLavender'}>
        {children}
      </Text>
    </TabHeaderContainer>
  );
};

const CardTabs = ({ headers, trackTab, children }) => {
  return (
    <Card>
      <Tabs
        trackTab={trackTab}
        header={
          <Flex>
            {headers.map((header, idx) => (
              <TabHeader key={idx}>{header}</TabHeader>
            ))}
          </Flex>
        }
      >
        {children}
      </Tabs>
    </Card>
  );
};

export default CardTabs;
