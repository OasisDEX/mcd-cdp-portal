import React from 'react';

import lang from 'languages';
import styled from 'styled-components';

import { prettifyNumber } from 'utils/ui';

// TODO: Use theme variables
const StyledSidebarSystem = styled.div`
  margin: 2.5rem 0;
  margin: 1.9rem 0;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.heading};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: 1.8rem;
  letter-spacing: -0.03rem;
  line-height: normal;
  & + div {
    margin-top: 2.5rem;
  }
`;

const Param = styled.div`
  color: #4f445e;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: 1.3rem;
  margin: 1rem 0;
`;

const Value = styled.div`
  color: ${({ theme }) => theme.colors.heading};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  font-size: 1.4rem;
  margin: 1rem 0 3.5rem;
`;

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
    <StyledSidebarSystem className="container">
      <Title>System Information</Title>
      {systemParams.map(([param, value], idx) => (
        <React.Fragment key={idx}>
          <Param>{param}</Param>
          <Value>{value}</Value>
        </React.Fragment>
      ))}
    </StyledSidebarSystem>
  );
};

export default SidebarSystem;
