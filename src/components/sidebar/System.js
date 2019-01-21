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
  color: #231536;
  font-weight: 600;
  font-size: 1.8rem;
  letter-spacing: -0.03rem;
  line-height: normal;
  & + div {
    margin-top: 2.5rem;
  }
`;

const Param = styled.div`
  color: #4f445e;
  font-weight: 700;
  font-size: 1.3rem;
  margin: 1rem 0;
`;

const Value = styled.div`
  color: #231536;
  font-weight: 400;
  font-size: 1.4rem;
  margin: 1rem 0 3.5rem;
`;

const SidebarSystem = ({ system }) => {
  const systemParams = [
    [
      lang.sidebar.global_debt_ceiling,
      prettifyNumber(system.globalDebtCeiling)
    ],
    [lang.sidebar.current_debt, prettifyNumber(system.totalDebt)],
    [lang.sidebar.burn_rate, `${system.baseRate} %`],
    [
      lang.sidebar.number_of_liquidations,
      prettifyNumber(system.numberOfLiquidations)
    ],
    [
      lang.sidebar.buy_and_burn_lot_size,
      prettifyNumber(system.surplusAuctionLotSize)
    ],
    [
      lang.sidebar.inflate_and_sell_lot_size,
      prettifyNumber(system.debtAuctionLotSize)
    ]
  ];

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
