import React from 'react';
import lang from 'languages';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Table, Button } from '@makerdao/ui-components-core';

import { getTokens, toggleTokenAllowance } from 'reducers/network/account';
import ToggleSwitch from 'components/ToggleSwitch';
import { prettifyNumber } from 'utils/ui';

const ColorStrip = ({ color }) => (
  <svg
    width="4"
    height="15"
    viewBox="0 0 4 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="2"
      y1="2"
      x2="2"
      y2="13"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

const SidebarWalletWrapper = styled.div`
  margin: 2.5rem 0;
`;

const StyledTable = styled(Table)`
  border-spacing: 0;
  thead tr {
    padding: 0.6rem 0;
    th {
      color: #48495f;
      text-align: left;
      text-transform: uppercase;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.01rem;
    }
  }
  tbody td {
    font-size: 1.3rem;
    font-weight: 700;
    color: #48495f;
    padding: 1.2rem 0 1rem;
    &.asset {
      white-space: nowrap;
    }
    &.balance {
      text-overflow: ellipsis;
      font-weight: 400;
      font-size: 1.4rem;
    }
    &.unlock {
      text-align: center;
    }
    & > svg {
      vertical-align: sub;
      margin-right: 8px;
    }
  }
`;

const Tr = styled.tr`
  &&:not(:last-child) {
    border-bottom: none;
  }
`;

const StyledButton = styled(Button)`
  padding: 0;
  width: 4.8rem;
  height: 2.4rem;
  font-size: 1rem;
  /* font-size: ${({ theme }) => theme.fontSizes.normal}; */
`;

function WalletTable({ tokens, toggleTokenAllowance }) {
  return (
    <StyledTable width="100%">
      <thead>
        <tr>
          <th>{lang.sidebar.wallet.column_asset}</th>
          <th>{lang.sidebar.wallet.column_balance}</th>
          <th>{lang.sidebar.wallet.column_send}</th>
          <th width="1">{lang.sidebar.wallet.column_unlock}</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(tokens).map(
          ([key, { balance, color, unlocked, unlockPending }]) => (
            <Tr key={key}>
              <td className="asset">
                <ColorStrip color={color} />
                {key}
              </td>
              <td className="balance">{prettifyNumber(balance)}</td>
              <td>
                <StyledButton variant="secondary">
                  {lang.sidebar.wallet.button_send}
                </StyledButton>
              </td>
              <td className="unlock">
                <ToggleSwitch
                  auto={false}
                  onToggle={on =>
                    !unlockPending && toggleTokenAllowance(key, on)
                  }
                  on={unlockPending ? !unlocked : unlocked}
                  pending={unlockPending}
                />
              </td>
            </Tr>
          )
        )}
      </tbody>
    </StyledTable>
  );
}

const SidebarWallet = ({ tokens, ...props }) => (
  <SidebarWalletWrapper>
    <WalletTable tokens={tokens} {...props} />
  </SidebarWalletWrapper>
);

function mapStateToProps(state) {
  return {
    tokens: getTokens(state)
  };
}
const mapDispatchToProps = {
  toggleTokenAllowance
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarWallet);
