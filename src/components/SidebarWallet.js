import React, { memo } from 'react';
import lang from 'languages';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Table, Button, Box } from '@makerdao/ui-components-core';

import { getTokens, setTokenAllowance } from 'reducers/network/account';
import ToggleSwitch from 'components/ToggleSwitch';
import { prettifyNumber } from 'utils/ui';
import useMaker from 'hooks/useMaker';

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

const Unlock = memo(({ gem, unlocked, setTokenAllowance }) => {
  const { maker } = useMaker();
  const [unlockPending, setUnlockPending] = React.useState(false);

  React.useEffect(() => {
    setUnlockPending(false);
  }, [unlocked]);

  async function toggleAllowance(gem, allow) {
    setUnlockPending(true);
    try {
      const proxyAddress = await maker.service('proxy').ensureProxy();

      // FIXME: The token service needs to allow custom currencies by passing them to the currency library's createGetCurrency()
      // allow
      //   ? await maker
      //       .service('allowance')
      //       .requireAllowance(gem, proxyAddress)
      //   : await maker
      //       .service('allowance')
      //       .removeAllowance(gem, proxyAddress);

      allow
        ? await maker.getToken(gem)._contract.approve(proxyAddress, -1)
        : await maker.getToken(gem)._contract.approve(proxyAddress, 0);

      setTokenAllowance(gem, allow);
    } catch (err) {
      // catch rejected signing request errors
      console.error('Error changing token allowance:', err);
      setUnlockPending(false);
    }
  }

  return (
    <ToggleSwitch
      auto={false}
      onToggle={on => !unlockPending && toggleAllowance(gem, on)}
      on={unlockPending ? !unlocked : unlocked}
      pending={unlockPending}
    />
  );
});

const StyledTable = styled(Table)`
  thead tr {
    padding: 0.6rem 0;
    th {
      color: ${({ theme }) => theme.colors.black3};
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
    color: ${({ theme }) => theme.colors.black3};
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

function SidebarWallet({ tokens }) {
  return (
    <Box>
      <StyledTable width="100%">
        <thead>
          <Tr>
            <th>{lang.sidebar.wallet.column_asset}</th>
            <th>{lang.sidebar.wallet.column_balance}</th>
            <th>{lang.sidebar.wallet.column_send}</th>
            <th width="1">{lang.sidebar.wallet.column_unlock}</th>
          </Tr>
        </thead>
        <tbody>
          {tokens.map(({ key, symbol, balance, color, unlocked }) => (
            <Tr key={key}>
              <td className="asset">
                <ColorStrip color={color} />
                {symbol}
              </td>
              <td className="balance">{prettifyNumber(balance, true)}</td>
              <td>
                <Button
                  css={`
                    padding: 0;
                    width: 4.8rem;
                    height: 2.4rem;
                    font-size: 1rem;
                  `}
                  variant="secondary"
                >
                  {lang.sidebar.wallet.button_send}
                </Button>
              </td>
              <td className="unlock">
                <Unlock
                  gem={key}
                  unlocked={unlocked}
                  setTokenAllowance={setTokenAllowance}
                />
              </td>
            </Tr>
          ))}
        </tbody>
      </StyledTable>
    </Box>
  );
}

function mapStateToProps(state) {
  return {
    tokens: getTokens(state)
  };
}
const mapDispatchToProps = {
  setTokenAllowance
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarWallet);
