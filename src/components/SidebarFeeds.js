import React, { useState } from 'react';
import { Text, Card, Flex, Link, CardBody } from '@makerdao/ui-components-core';
import { formatter } from 'utils/ui';
import Carat from './Carat';
import styled from 'styled-components';
import { ReactComponent as ExternalLinkIcon } from 'images/external-link.svg';
import useLanguage from 'hooks/useLanguage';
import BigNumber from 'bignumber.js';

const StyledCardBody = styled(CardBody)`
  cursor: pointer;
`;

const SidebarFeeds = ({ feeds }) => {
  const [collapsed, setCollapsed] = useState(true);
  const { lang } = useLanguage();

  return (
    <Card pt="sm" css={'overflow:hidden;'}>
      <Flex justifyContent="space-between" alignContent="center" px="s" pt="">
        <Text t="h4">{lang.sidebar.price_feeds}</Text>
        <Link href={'https://makerdao.com/feeds'} target="_blank">
          <Text t="p5" color="steel" fontSize="s2">
            {lang.sidebar.view_price_feeds}
          </Text>
          &nbsp;
          <ExternalLinkIcon fill="#708390" />
        </Link>
      </Flex>

      <CardBody mt="s2">
        {feeds &&
          Object.values(
            feeds.reduce(
              (acc, price) => ({
                ...acc,
                [price.symbol]: price
              }),
              {}
            )
          ).map(
            (value, index) =>
              (!collapsed || index < 4) && (
                <Flex
                  key={`feed_${index}`}
                  justifyContent="space-between"
                  alignItems="baseline"
                  width="100%"
                  py="xs"
                  px="s"
                  bg={index % 2 ? 'coolGrey.100' : 'white'}
                >
                  <Text
                    color="darkLavender"
                    fontWeight="semibold"
                    t="smallCaps"
                  >
                    {value.symbol
                      .split('/')
                      .reverse()
                      .join('/')}
                  </Text>
                  <Text fontSize="1.4rem" color="darkPurple">
                    {`${formatter(value, {
                      rounding: BigNumber.ROUND_HALF_UP
                    })} ${value.symbol}`}
                  </Text>
                </Flex>
              )
          )}
      </CardBody>
      {feeds && feeds.length > 4 && (
        <StyledCardBody p="s" onClick={() => setCollapsed(!collapsed)}>
          <Flex justifyContent="center" alignItems="center">
            {collapsed ? (
              <>
                <Text pr="xs">{lang.sidebar.view_more}</Text>
                <Carat />
              </>
            ) : (
              <>
                <Text pr="xs">{lang.sidebar.view_less}</Text>
                <Carat rotation={180} />
              </>
            )}
          </Flex>
        </StyledCardBody>
      )}
    </Card>
  );
};

export default SidebarFeeds;
