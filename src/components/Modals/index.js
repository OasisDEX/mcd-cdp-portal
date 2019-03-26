import React from 'react';
import CDPCreate from 'components/CDPCreate';
import LedgerType from 'components/LedgerType';
import HardwareWalletModal from 'components/HardwareWalletModal';
import { Grid } from '@makerdao/ui-components-core';
import templates from './templates';
import { AccountTypes } from '../../utils/constants';

const modals = {
  cdpcreate: ({ onClose }) => (
    <Grid
      gridRowGap="s"
      gridTemplateRows="auto 1fr"
      p="m"
      maxWidth="100%"
      width="100vw"
      height="100vh"
      bg="grayLight5"
      onClick={e => e.stopPropagation()}
      css={`
        overflow-y: auto;
      `}
    >
      <CDPCreate onClose={onClose} />
    </Grid>
  ),

  ledgertype: ({ onClose }) => <LedgerType onClose={onClose} />,

  ledger: ({ onClose, isLedgerLive }) => (
    <HardwareWalletModal
      isLedgerLive={isLedgerLive}
      onClose={onClose}
      type={AccountTypes.LEDGER}
    />
  ),

  trezor: ({ onClose }) => (
    <HardwareWalletModal onClose={onClose} type={AccountTypes.TREZOR} />
  )
};

export { templates };
export default modals;
