import React, { Fragment } from 'react';
import lang from 'languages';
import { Text, Box, Card, CardBody, Flex } from '@makerdao/ui-components-core';
import { prettifyNumber } from 'utils/ui';

const Entry = ({ text, value, ...props }) => (
  <Flex
    justifyContent="space-between"
    alignItems="center"
    width="100%"
    py="xs"
    px="s"
    {...props}
  >
    <Text color="steel" fontWeight="semibold" t="smallCaps">
      {text}
    </Text>
    <Text fontSize="1.4rem" color="darkPurple">
      {value}
    </Text>
  </Flex>
);

const SidebarDetails = () => {
  return (
    <Card css={'overflow:hidden;'} pt="2xs">
      <Box p="s" pb="0" mb="xs">
        <Text t="h4">{lang.sidebar.save_details.title}</Text>
      </Box>
      <CardBody mt="xs">
        <Entry
          text={lang.sidebar.save_details.total_savings_dai}
          value={1234}
          bg="white"
        />
        <Entry
          text={lang.sidebar.save_details.total_dai_supply}
          value={1234}
          bg="coolGrey.100"
        />
      </CardBody>
    </Card>
  );
};

export default SidebarDetails;
