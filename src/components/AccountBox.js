import React, { useState, useCallback } from 'react';
import { Card } from '@makerdao/ui-components-core';
import { getSpace } from 'styles/theme';
import AccountConnect from './SidebarAccountConnect';
import ActiveAccount from 'components/ActiveAccount';
import WalletConnectDropdown from 'components/WalletConnectDropdown';

function AccountBox({ currentAccount }) {
  const [open, setOpen] = useState(false);
  const toggleDropdown = useCallback(() => setOpen(!open), [open, setOpen]);
  const closeDropdown = useCallback(() => setOpen(false), [setOpen]);

  return (
    <Card p="s">
      <WalletConnectDropdown
        show={open}
        offset={`-${getSpace('s') + 1}, 0`}
        openOnHover={false}
        onClick={toggleDropdown}
        close={closeDropdown}
        trigger={
          currentAccount ? (
            <ActiveAccount currentAccount={currentAccount} />
          ) : (
            <AccountConnect />
          )
        }
      />
    </Card>
  );
}

export default AccountBox;
