import React from 'react';
import useLanguage from 'hooks/useLanguage';
import { Text, Box, Card, CardBody, Flex } from '@makerdao/ui-components-core';
import { prettifyNumber, formatter } from 'utils/ui';
import TextMono from 'components/TextMono';

const SidebarDetails = ({ system, savings }) => {
  const { lang } = useLanguage();

  const TOTAL_DAI_SUPPLY = ({ system }) => [
    lang.sidebar.save_details.total_dai_supply,
    prettifyNumber(system.totalDaiSupply)
  ];

  const TOTAL_SAVINGS_DAI = ({ system }) => [
    lang.sidebar.save_details.total_savings_dai,
    prettifyNumber(system.totalDaiLockedInDsr)
  ];

  const DAI_SAVINGS_RATE = ({ system }) => [
    lang.sidebar.save_details.dai_savings_rate,
    system.annualDaiSavingsRate
      ? formatter(system.annualDaiSavingsRate) + '%'
      : ''
  ];

  const params = [TOTAL_DAI_SUPPLY, TOTAL_SAVINGS_DAI, DAI_SAVINGS_RATE].map(
    f => f({ system, savings })
  );

  return (
    <Card css={'overflow:hidden;'} pt="2xs">
      <Box p="s" pb="0" mb="xs">
        <Text t="h4">{lang.sidebar.save_details.title}</Text>
      </Box>
      <CardBody mt="xs">
        {params.map(([param, value], idx) => (
          <Flex
            key={`details_${param}`}
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            py="xs"
            px="s"
            bg={idx % 2 ? 'coolGrey.100' : 'white'}
          >
            <Text color="steel" fontWeight="semibold" t="smallCaps">
              {param}
            </Text>
            <TextMono fontSize="1.4rem" color="darkPurple">
              {value}
            </TextMono>
          </Flex>
        ))}
      </CardBody>
    </Card>
  );
};

export default SidebarDetails;
