import React from 'react';
import CDPCreate from 'components/CDPCreate';
import CDPMigrate from 'components/CDPMigrate';
import LedgerType from 'components/LedgerType';
import HardwareWalletModal from 'components/HardwareWalletModal';
import { Grid } from '@makerdao/ui-components-core';
import templates from './templates';

const modals = {
  cdpcreate: ({ onClose }) => (
    <Grid
      height="100vh"
      width="100%"
      bg="backgroundGrey"
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
      maxWidth="100%"
      width="100vw"
      height="100vh"
      bg="backgroundGrey"
      onClick={e => e.stopPropagation()}
      css={`
        overflow-y: auto;
      `}
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
