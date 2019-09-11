import React, { Fragment, useEffect, useState } from 'react';
import lang from 'languages';
import { Link } from 'react-navi';
import { Text, Box, Card, Flex } from '@makerdao/ui-components-core';
import { formatCollateralizationRatio } from 'utils/ui';
import SiteVersion from 'components/SiteVersion';
import { Routes } from '../utils/constants';
import useMaker from 'hooks/useMaker';

const SidebarSystem = ({ system }) => {
  const { maker } = useMaker();
  const [sysColRatio, setSysColRatio] = useState(null);
  useEffect(() => {
    const prefetchData = async () => {
      await maker.service('mcd:cdpType').prefetchAllCdpTypes();
      setSysColRatio(
        maker
          .service('mcd:cdpType')
          .totalCollateralizationRatioAllCdpTypes.times(100)
          .toNumber()
      );
    };
    prefetchData();
  }, [maker]);
  const systemParams = [
    [
      lang.sidebar.system_collateralization,
      formatCollateralizationRatio(sysColRatio)
    ]
  ];

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
        {process.env.NODE_ENV === 'production' ? <SiteVersion /> : null}
      </Box>
      <Flex p="xs" border="1px solid lightgray" borderRadius="3px">
        <Link href={`/${Routes.SAVE}`}>
          <Text fontSize="1.2rem" color="lightgray">
            {'> /save'}
          </Text>
        </Link>
      </Flex>
    </Fragment>
  );
};

export default SidebarSystem;
