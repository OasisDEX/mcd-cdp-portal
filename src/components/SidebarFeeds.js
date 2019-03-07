import React from 'react';
import lang from 'languages';
import styled from 'styled-components';
import { Box, Text } from '@makerdao/ui-components-core';
import { prettifyNumber } from 'utils/ui';

const Table = styled.table`
  width: 100%;
  border-spacing: 0;
  tr:not(:last-child) td {
    border-bottom: 1px solid #e5e5e5;
  }
`;

const Td = styled.td`
  padding: 1.2rem 0 1rem;
`;

const TdRight = styled(Td)`
  text-align: right;
`;

function FeedsTable({ feeds }) {
  const rows = feeds.map(({ pair, value }) => (
    <tr key={pair}>
      <Td>
        <Text t="p5" fontWeight="bold" color="black4">
          {pair}
        </Text>
      </Td>
      <TdRight>
        <Text t="p5" fontWeight="normal">
          {prettifyNumber(value)}
        </Text>
      </TdRight>
    </tr>
  ));

  return (
    <Table>
      <tbody>{rows}</tbody>
    </Table>
  );
}

const SidebarFeeds = ({ feeds }) => (
  <Box py="m">
    <Box pb="s">
      <Text t="p2" fontWeight="bold" color="heading">
        {lang.sidebar.price_feeds}
      </Text>
    </Box>

    <FeedsTable feeds={feeds} />
  </Box>
);

export default SidebarFeeds;
