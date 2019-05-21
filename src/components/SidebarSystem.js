import React, { Fragment } from 'react';
import lang from 'languages';
import { Text, Box, Card, Flex } from '@makerdao/ui-components-core';
import { prettifyNumber } from 'utils/ui';
import SiteVersion from 'components/SiteVersion';

const GLOBAL_DEBT_CEILING = system => [
  lang.sidebar.global_debt_ceiling,
  prettifyNumber(system.globalDebtCeiling)
];

const CURRENT_DEBT = system => [
  lang.sidebar.current_debt,
  prettifyNumber(system.totalDebt)
];

const BASE_RATE = system => [lang.sidebar.base_rate, `${system.baseRate} %`];

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
    SURPLUS_AUCTION_LOT_SIZE,
    DEBT_AUCTION_LOT_SIZE
  ].map(f => f(system));

  return (
    <Fragment>
      <Card css={'overflow:hidden;'} pt="2xs">
        <Box p="s" pb="0" mb="xs">
          <Text t="h4">System Info</Text>
        </Box>
        {systemParams.map(([param, value], idx) => (
          <Flex
            key={`system_${param}`}
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            py="xs"
            px="s"
            bg={idx % 2 ? 'coolGrey.100' : 'white'}
          >
            <Text color="darkLavender" fontWeight="semibold" t="smallCaps">
              {param}
            </Text>
            <Box pt="2xs">
              <Text fontSize="s" color="darkPurple">
                {value}
              </Text>
            </Box>
          </Flex>
        ))}
      </Card>
      <Box px="s">
        <SiteVersion />
      </Box>
    </Fragment>
  );
};

export default SidebarSystem;
