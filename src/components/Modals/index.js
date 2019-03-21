import React from 'react';
import CDPCreate from 'components/CDPCreate';
import LedgerType from 'components/LedgerType';
import LedgerAddresses from 'components/LedgerAddresses';
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
      bg="grayLight5"
      onClick={e => e.stopPropagation()}
      css={`
        overflow-y: auto;
      `}
    >
      <CDPCreate onClose={onClose} />
    </Grid>
  ),

  ledgertype: ({ onClose }) => {
    return (
      <Grid
        gridRowGap="s"
        gridTemplateRows="50px 1fr"
        maxWidth="100%"
        onClick={e => e.stopPropagation()}
      >
        <LedgerType onClose={onClose} />
      </Grid>
    );
  },

  ledgeraddresses: ({ onClose, isLedgerLive }) => (
    <Grid
      gridRowGap="s"
      gridTemplateRows="50px 1fr"
      maxWidth="100%"
      onClick={e => e.stopPropagation()}
    >
      <LedgerAddresses isLedgerLive={isLedgerLive} onClose={onClose} />
    </Grid>
  )
};

export { templates };
export default modals;
