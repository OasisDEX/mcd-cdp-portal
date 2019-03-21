import React, { Fragment } from 'react';

import { Box, Button, Flex } from '@makerdao/ui-components-core';
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

function LedgerType({ onClose }) {
  const { show } = useModal();

  return (
    <Fragment>
      <Flex justifyContent="flex-end">
        <Box onClick={onClose}>Close</Box>
      </Flex>
      <StyledTitle>Connect Ledger Live or Legacy</StyledTitle>
      <ButtonCard
        icon={<StyledLedgerLogo />}
        onClick={() => {
          show({
            modalType: 'ledgeraddresses',
            modalData: { isLedgerLive: true },
            modalTemplate: 'simple'
          });
        }}
        title="Ledger live"
        subtitle={<BreakableText color="grey">{"44'/60'/0'/0"}</BreakableText>}
        buttonText="Connect"
      />
      <ButtonCard
        icon={<StyledLedgerLogo />}
        onClick={() => {
          show({
            modalType: 'ledgeraddresses',
            modalData: { isLedgerLive: false },
            modalTemplate: 'simple'
          });
        }}
        title="Ledger legacy"
        subtitle={<BreakableText color="grey">{"44'/60'/0'/0"}</BreakableText>}
        buttonText="Connect"
      />
      <Box justifySelf="center">
        <Button variant="secondary-outline" onClick={onClose}>
          Select another wallet
        </Button>
      </Box>
    </Fragment>
  );
}

export default LedgerType;
