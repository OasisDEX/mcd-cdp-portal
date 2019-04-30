import React from 'react';
import { Box } from '@makerdao/ui-components-core';
import CDPCreate from 'components/CDPCreate';
import CDPMigrate from 'components/CDPMigrate';
import LedgerType from 'components/LedgerType';
import HardwareWalletModal from 'components/HardwareWalletModal';
import templates from './templates';

const modals = {
  cdpcreate: ({ onClose }) => (
    <Box
      bg="backgroundGrey"
      minHeight="100vh"
      p="m"
      onClick={e => e.stopPropagation()}
    >
      <CDPCreate onClose={onClose} />
    </Box>
  ),

  cdpmigrate: ({ onClose }) => (
    <Box
      bg="backgroundGrey"
      minHeight="100vh"
      p="m"
      onClick={e => e.stopPropagation()}
    >
      <CDPMigrate onClose={onClose} />
    </Box>
  ),

  ledgertype: args => <LedgerType {...args} />,

  ledger: args => <HardwareWalletModal {...args} />,

  trezor: args => <HardwareWalletModal {...args} />
};

export { templates };
export default modals;
