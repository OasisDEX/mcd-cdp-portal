import React, { Fragment } from 'react';
import { Text, Box, Card, Flex } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';
import { prettifyNumber } from 'utils/ui';
import SiteVersion from 'components/SiteVersion';

const SidebarSystem = ({ system }) => {
  const { lang } = useLanguage();

  const ACTIVE_CDPS = system => [
    lang.sidebar.active_cdps,
    lang.formatString(
      lang.sidebar.active_cdps_figure,
      prettifyNumber(parseInt(system.totalCdps))
    )
  ];

  const TOTAL_DAI_SUPPLY = system => [
    lang.sidebar.save_details.total_dai_supply,
    prettifyNumber(system.totalDebt)
  ];

  const SYSTEM_COLLATERALIZATION = system => [
    lang.sidebar.system_collateralization,
    `${prettifyNumber(system.systemCollateralization, false, 2, false)}%`
  ];

  const systemParams = [
    SYSTEM_COLLATERALIZATION,
    TOTAL_DAI_SUPPLY,
    ACTIVE_CDPS
  ].map(f => f(system));

  return (
    <Fragment>
      <Card css={'overflow:hidden;'} pt="sm">
        <Flex
          justifyContent="space-between"
          alignContent="center"
          px="s"
          pb="s2"
        >
          <Text t="h4">{lang.sidebar.system_info}</Text>
        </Flex>
        {systemParams.map(([param, value], idx) => (
          <Flex
            key={`system_${param}`}
            justifyContent="space-between"
            alignItems="baseline"
            width="100%"
            py="xs"
            px="s"
            bg={idx % 2 ? 'coolGrey.100' : 'white'}
          >
            <Text color="darkLavender" fontWeight="semibold" t="smallCaps">
              {param}
            </Text>
            <Box>
              <Text fontSize="s" color="darkPurple">
                {value}
              </Text>
            </Box>
          </Flex>
        ))}
      </Card>
      <Box px="s">
        {process.env.NODE_ENV === 'production' ? <SiteVersion /> : null}
      </Box>
    </Fragment>
  );
};

export default SidebarSystem;
