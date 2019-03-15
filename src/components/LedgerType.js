import React, { useState, useEffect, Fragment } from 'react';

import StepperUI from 'components/StepperUI';
import { Box, Button, Grid, Text } from '@makerdao/ui-components-core';
import { Block } from 'components/Primitives';

import lang from 'languages';
import styled from 'styled-components';

import { BreakableText } from './Typography';
import { ReactComponent as LedgerLogo } from 'images/ledger.svg';

import { prettifyNumber } from 'utils/ui';
import useMakerState from 'hooks/useMakerState';

const HARDCODED_USER_ADDRESS_FOR_DEVELOPMENT =
  '0x00DaA9a2D88BEd5a29A6ca93e0B7d860cd1d403F';

// hack to get around button padding for now
const StyledLedgerLogo = styled(LedgerLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

function LedgerType({ onLedgerLive, onLedgerLegacy, onCancel }) {
  return (
    <Fragment>
      <Button
        icon={<StyledLedgerLogo />}
        onNext={onLedgerLive}
        title="Ledger live"
        subtitle={<BreakableText color="grey">{"44'/60'/0'/0"}</BreakableText>}
        buttonText="Connect"
      />
      <Button
        icon={<StyledLedgerLogo />}
        onNext={onLedgerLegacy}
        title="Ledger legacy"
        subtitle={<BreakableText color="grey">{"44'/60'/0'/0"}</BreakableText>}
        buttonText="Connect"
      />
      <Box justifySelf="center">
        <Button variant="secondary-outline" onClick={onCancel}>
          Select another wallet
        </Button>
      </Box>
    </Fragment>
  );
}

export default LedgerType;
