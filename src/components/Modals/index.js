import React from 'react';
import CDPCreate from 'components/CDPCreate';
import CDPMigrate from 'components/CDPMigrate';
import LedgerType from 'components/LedgerType';
import HardwareWalletModal from 'components/HardwareWalletModal';
import templates from './templates';

const modals = {
  cdpcreate: ({ onClose }) => (
    <Grid
      bg="backgroundGrey"
      minHeight="100vh"
      p="m"
      onClick={e => e.stopPropagation()}
    >
      <CDPCreate onClose={onClose} />
    </Grid>
  ),

  cdpmigrate: ({ onClose }) => (
    <Grid
      gridRowGap="s"
      gridTemplateRows="auto 1fr"
      p="m"
      minHeight="100vh"
      bg="backgroundGrey"
      onClick={e => e.stopPropagation()}
    >
      <CDPMigrate onClose={onClose} />
    </Grid>
  ),

  ledgertype: args => <LedgerType {...args} />,

  ledger: args => <HardwareWalletModal {...args} />,

  trezor: args => <HardwareWalletModal {...args} />
};

export { templates };
export default modals;
