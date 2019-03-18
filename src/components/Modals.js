import React from 'react';
import CDPCreate from 'components/CDPCreate';
import LedgerType from 'components/LedgerType';
import LedgerAddresses from './LedgerAddresses';
import { Grid, Flex, Box } from '@makerdao/ui-components-core';

const modals = {
  cdpcreate: ({ onClose }) => (
    <Grid
      gridRowGap="s"
      gridTemplateRows="50px 1fr"
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
      <Flex justifyContent="flex-end">
        <Box onClick={onClose}>Close</Box>
      </Flex>
      <CDPCreate />
    </Grid>
  ),
  ledgertype: ({ onClose }) => <LedgerType onClose={onClose} />,
  ledgeraddresses: ({ onClose, isLedgerLive }) => (
    <LedgerAddresses isLedgerLive={isLedgerLive} onClose={onClose} />
  )
};

export default modals;
