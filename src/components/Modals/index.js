import React from 'react';
import { Box } from '@makerdao/ui-components-core';
import CDPCreate from 'components/CDPCreate';
import CDPMigrate from 'components/CDPMigrate';
import DSRDeposit from 'components/DSRDeposit';
import LedgerType from 'components/LedgerType';
import HardwareAccountSelect from 'components/HardwareAccountSelect';
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

  dsrdeposit: ({ onClose }) => (
    <Box
      bg="backgroundGrey"
      minHeight="100vh"
      p="m"
      onClick={e => e.stopPropagation()}
    >
      <DSRDeposit onClose={onClose} />
    </Box>
  ),

  ledgertype: args => <LedgerType {...args} />,

  hardwareaccountselect: args => <HardwareAccountSelect {...args} />
};

export { templates };
export default modals;
