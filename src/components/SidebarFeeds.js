import React, { useState } from 'react';
import { Text, Card, Flex, Link, CardBody } from '@makerdao/ui-components-core';
import { prettifyNumber } from 'utils/ui';
import Carat from './Carat';
import styled from 'styled-components';
import { ReactComponent as ExternalLinkIcon } from 'images/external-link.svg';
import useLanguage from 'hooks/useLanguage';

const StyledCardBody = styled(CardBody)`
  cursor: pointer;
`;

const SidebarFeeds = ({ feeds }) => {
  const [collapsed, setCollapsed] = useState(true);
  const { lang } = useLanguage();

  return (
    <Card pt="s" css={'overflow:hidden;'}>
      <Flex justifyContent="space-between" alignContent="center" px="s">
        <Text t="h4">{lang.sidebar.price_feeds}</Text>
        <Link href={'https://makerdao.com/feeds'} target="_blank">
          <Text t="p5" color="steel">
            {lang.sidebar.view_price_feeds}
          </Text>
          &nbsp;
          <ExternalLinkIcon fill="#708390" />
        </Link>
      </Flex>

      <CardBody mt="xs">
        {feeds.map(
          ({ pair, value }, index) =>
            (!collapsed || index < 3) && (
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
            )
        )}
      </CardBody>
      {feeds.length > 3 && (
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
