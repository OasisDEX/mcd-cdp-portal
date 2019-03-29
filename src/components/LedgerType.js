import React from 'react';

import { Box, Button, Flex, Grid } from '@makerdao/ui-components-core';
import ButtonCard from './ButtonCard';

import styled from 'styled-components';

import { BreakableText } from './Typography';
import { ReactComponent as LedgerLogo } from 'images/ledger.svg';

// hack to get around button padding for now
const StyledLedgerLogo = styled(LedgerLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

export const StyledTitle = styled.div`
  font-weight: bold;
  color: #212536;
  line-height: 22px;
  font-size: 28px;
`;

const LEDGER_LIVE_PATH = "44'/60'/0'";
const LEDGER_LEGACY_PATH = "44'/60'/0'/0";

function LedgerType({ onClose, renderByPath }) {
  return (
    <Grid gridRowGap="s" p="m">
      <Flex justifyContent="flex-end">
        <Box onClick={onClose}>Close</Box>
      </Flex>
      <StyledTitle>Connect Ledger Live or Legacy</StyledTitle>
      <ButtonCard
        icon={<StyledLedgerLogo />}
        onClick={() => renderByPath(LEDGER_LIVE_PATH)}
        title="Ledger live"
        subtitle={<BreakableText color="grey">{"44'/60'/0'/0"}</BreakableText>}
        buttonText="Connect"
      />
      <ButtonCard
        icon={<StyledLedgerLogo />}
        onClick={() => renderByPath(LEDGER_LEGACY_PATH)}
        title="Ledger legacy"
        subtitle={<BreakableText color="grey">{"44'/60'/0'/0"}</BreakableText>}
        buttonText="Connect"
      />
      <Box justifySelf="center">
        <Button variant="secondary-outline" onClick={onClose}>
          Select another wallet
        </Button>
      </Box>
    </Grid>
  );
}

export default LedgerType;
