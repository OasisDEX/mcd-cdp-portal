import React, { Fragment } from 'react';
import { Text, Box, Card, Flex } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';
import SiteVersion from 'components/SiteVersion';
import { prettifyCurrency } from 'utils/ui';

const SidebarArbitrage = ({ psmInfo }) => {
  const { lang } = useLanguage();
  const interfaceLocale = lang.getInterfaceLanguage();
  const formatAmount = amount =>
    prettifyCurrency(interfaceLocale, amount.toBigNumber(), 2);

  const content = Object.entries(psmInfo).reduce(
    (acc, [ilk, { ceiling, collateral, debtAvailable }]) => {
      const prettifiedIlk = ilk.substring(4, ilk.length);
      return [
        ...acc,
        [prettifiedIlk, lang.collateral_debt_ceiling, ceiling],
        [prettifiedIlk, lang.cdp_page.locked, collateral],
        [prettifiedIlk, lang.arb.available, debtAvailable]
      ];
    },
    []
  );

  return (
    <Fragment>
      <Card css={'overflow:hidden;'} pt="sm">
        <Flex
          justifyContent="space-between"
          alignContent="center"
          px="s"
          pb="s2"
        >
          <Text t="h4">{lang.arb.system_info}</Text>
        </Flex>
        {content.map(([ilk, message, value], idx) => (
          <Box key={`system_${idx}`}>
            {idx % 3 ? null : (
              <Box mt="s">
                <Text px="s" fontWeight="bold">
                  {ilk}
                </Text>
              </Box>
            )}

            <Flex
              justifyContent="space-between"
              alignItems="baseline"
              width="100%"
              py="xs"
              px="s"
              bg={idx % 2 ? 'coolGrey.100' : 'white'}
            >
              <Text color="darkLavender" fontWeight="semibold" t="smallCaps">
                {message}
              </Text>
              <Box>
                <Text fontSize="s" color="darkPurple">
                  {formatAmount(value)} {value.symbol}
                </Text>
              </Box>
            </Flex>
          </Box>
        ))}
      </Card>
      <Box px="s">
        {process.env.NODE_ENV === 'production' ? <SiteVersion /> : null}
      </Box>
    </Fragment>
  );
};

export default SidebarArbitrage;
