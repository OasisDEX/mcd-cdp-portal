import React from 'react';
import styled from 'styled-components';

import { Box, Button, Flex, Grid, Text } from '@makerdao/ui-components-core';
import ButtonCard from './ButtonCard';

import { BreakableText } from './Typography';
import { ReactComponent as LedgerLogo } from 'images/ledger.svg';
import { ReactComponent as Cross } from 'images/cross.svg';
import lang from 'languages';

// hack to get around button padding for now
const StyledLedgerLogo = styled(LedgerLogo)`
  max-width: 16px;
  max-height: 16px;
`;

export const LEDGER_LIVE_PATH = "44'/60'/0'";
const LEDGER_LEGACY_PATH = "44'/60'/0'/0";

function LedgerType({ onClose, onPathSelect }) {
  return (
    <Grid gridRowGap="m" px="m" py="s" width={['auto', '52rem']}>
      <Flex justifyContent="flex-end">
        <Box onClick={onClose} css={{ cursor: 'pointer' }}>
          <Cross />
        </Box>
      </Flex>
      <Grid gridRowGap="m">
        <Text.h3 textAlign="center">
          {lang.formatString(
            lang.overview_page.connect_ledgers_choice,
            'Ledger Live',
            'Legacy'
          )}
        </Text.h3>

        <Grid gridRowGap="s">
          <ButtonCard
            icon={<StyledLedgerLogo />}
            onClick={() => onPathSelect(LEDGER_LIVE_PATH)}
            title="Ledger live"
            subtitle={
              <BreakableText color="grey">{"m/44'/60'/0'/x"}</BreakableText>
            }
            buttonText={lang.connect}
          />
          <ButtonCard
            icon={<StyledLedgerLogo />}
            onClick={() => onPathSelect(LEDGER_LEGACY_PATH)}
            title="Ledger legacy"
            subtitle={
              <BreakableText color="grey">{"m/44'/x'/0/0"}</BreakableText>
            }
            buttonText={lang.connect}
          />
        </Grid>

        <Box justifySelf="center">
          <Button variant="secondary-outline" onClick={onClose}>
            {lang.overview_page.select_another_wallet}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

export default LedgerType;
