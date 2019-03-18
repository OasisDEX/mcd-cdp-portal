import React from 'react';

import { Box, Button, Grid, Flex } from '@makerdao/ui-components-core';
import ButtonCard from './ButtonCard';

import styled from 'styled-components';

import { BreakableText } from './Typography';
import { ReactComponent as LedgerLogo } from 'images/ledger.svg';

import useModal from 'hooks/useModal';

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

// const onClose = () => {};

function LedgerType({ onLedgerLegacy, onCancel, onClose }) {
  const { showByType } = useModal();

  return (
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
      <StyledTitle>Connect Ledger Live or Legacy</StyledTitle>
      <ButtonCard
        icon={<StyledLedgerLogo />}
        onClick={() => {
          showByType('ledgeraddresses');
        }}
        title="Ledger live"
        subtitle={<BreakableText color="grey">{"44'/60'/0'/0"}</BreakableText>}
        buttonText="Connect"
      />
      <ButtonCard
        icon={<StyledLedgerLogo />}
        onClick={onLedgerLegacy}
        title="Ledger legacy"
        subtitle={<BreakableText color="grey">{"44'/60'/0'/0"}</BreakableText>}
        buttonText="Connect"
      />
      <Box justifySelf="center">
        <Button variant="secondary-outline" onClick={onCancel}>
          Select another wallet
        </Button>
      </Box>
    </Grid>
  );
}

export default LedgerType;
