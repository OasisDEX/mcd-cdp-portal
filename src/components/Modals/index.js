import React from 'react';
import CDPCreate from 'components/CDPCreate';
import LedgerType from 'components/LedgerType';
import HardwareWalletModal from 'components/HardwareWalletModal';
import { Grid } from '@makerdao/ui-components-core';
import templates from './templates';

const modals = {
  cdpcreate: ({ onClose }) => (
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
      <CDPCreate onClose={onClose} />
    </Grid>
  ),

  ledgertype: args => <LedgerType {...args} />,

  ledger: args => <HardwareWalletModal {...args} />,

  trezor: args => <HardwareWalletModal {...args} />
};

export { templates };
export default modals;
