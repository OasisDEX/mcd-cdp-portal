import React from 'react';

import lang from 'languages';
import styled from 'styled-components';

import { prettifyNumber } from 'utils/ui';

const SidebarFeedsWrapper = styled.div`
  margin: 2.5rem 0;
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 0;
  tr:not(:last-child) td {
    border-bottom: 1px solid #e5e5e5;
  }
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.heading};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: 1.8rem;
  letter-spacing: -0.03rem;
  line-height: normal;
  margin: 0.67em 0;
`;

const Td = styled.td`
  padding: 1.2rem 0 1rem;
`;

const Pair = styled(Td)`
  color: #4f445e;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: 1.3rem;
`;

const Price = styled(Td)`
  color: ${({ theme }) => theme.colors.heading};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  font-size: 1.4rem;
  text-align: right;
`;

function FeedsTable({ feeds }) {
  const rows = feeds.map(({ pair, value }) => (
    <tr key={pair}>
      <Pair>{pair}</Pair>
      <Price>{prettifyNumber(value)}</Price>
    </tr>
  ));

  return (
    <Table>
      <tbody>{rows}</tbody>
    </Table>
  );
}

const SidebarFeeds = ({ feeds }) => (
  <SidebarFeedsWrapper>
    <Title>{lang.sidebar.price_feeds}</Title>
    <FeedsTable feeds={feeds} />
  </SidebarFeedsWrapper>
);

export default SidebarFeeds;
