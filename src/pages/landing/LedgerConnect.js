import React, { useState } from 'react';

import lang from 'languages';
import styled from 'styled-components';

import { Button, Modal, Flex } from '@makerdao/ui-components';
import { ReactComponent as LedgerLogo } from 'images/ledger.svg';

// hack to get around button padding for now
const StyledLedgerLogo = styled(LedgerLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

const PaddedDiv = styled.div`
  padding: 20px;
`;

function LedgerConnect() {
  const [modelOpen, setModalBool] = useState(false);

  return (
    <>
      <Modal
        show={modelOpen}
        onClose={() => {
          setModalBool(false);
        }}
      >
        <PaddedDiv>
          <h3>Modal Content</h3>
        </PaddedDiv>
      </Modal>

      <Button
        variant="secondary-outline"
        width="225px"
        onClick={() => {
          setModalBool(true);
        }}
      >
        <Flex alignItems="center">
          <StyledLedgerLogo />
          <span style={{ margin: 'auto' }}>
            {lang.landing_page.ledger_nano}
          </span>
        </Flex>
      </Button>
    </>
  );
}

export default LedgerConnect;
