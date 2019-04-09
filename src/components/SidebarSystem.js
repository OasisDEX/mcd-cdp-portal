import React from 'react';

import lang from 'languages';
import { Text, Box, Card, Flex } from '@makerdao/ui-components-core';

import { prettifyNumber } from 'utils/ui';

const GLOBAL_DEBT_CEILING = system => [
  lang.sidebar.global_debt_ceiling,
  prettifyNumber(system.globalDebtCeiling)
];

const CURRENT_DEBT = system => [
  lang.sidebar.current_debt,
  prettifyNumber(system.totalDebt)
];

const BASE_RATE = system => [lang.sidebar.base_rate, `${system.baseRate} %`];

const NUMBER_OF_LIQUIDATIONS = system => [
  lang.sidebar.number_of_liquidations,
  prettifyNumber(system.numberOfLiquidations)
];

const SURPLUS_AUCTION_LOT_SIZE = system => [
  lang.sidebar.buy_and_burn_lot_size,
  prettifyNumber(system.surplusAuctionLotSize)
];

const DEBT_AUCTION_LOT_SIZE = system => [
  lang.sidebar.inflate_and_sell_lot_size,
  prettifyNumber(system.debtAuctionLotSize)
];

const SidebarSystem = ({ system }) => {
  const systemParams = [
    GLOBAL_DEBT_CEILING,
    CURRENT_DEBT,
    BASE_RATE,
    NUMBER_OF_LIQUIDATIONS,
    SURPLUS_AUCTION_LOT_SIZE,
    DEBT_AUCTION_LOT_SIZE
  ].map(f => f(system));

  return (
    <Card>
      <Box p="s" pb="0">
        <Text t="headingS" fontWeight="medium" color="heading">
          System Info
        </Text>
      </Box>
      {systemParams.map(([param, value], idx) => (
        <Flex
          key={`system_${param}`}
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          py="xs"
          px="s"
          bg={idx % 2 ? 'grayLight5' : 'white'}
        >
          <Text color="black4" fontWeight="semibold" t="smallCaps">
            {param}
          </Text>
          <Box pt="2xs">
            <Text color="heading" fontWeight="normal" t="p5">
              {value}
            </Text>
          </Box>
        </Flex>
      ))}
    </Card>
  );
};

export default SidebarSystem;
