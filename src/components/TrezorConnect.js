import React, { useState } from 'react';

import lang from 'languages';
import styled from 'styled-components';

import { Button, Modal, Flex, Box } from '@makerdao/ui-components-core';
import { ReactComponent as Logo } from 'images/trezor.svg';

const TrezorLogo = styled(Logo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

function TrezorConnect() {
  const [modelOpen, setModalBool] = useState(false);

  return (
    <>
      <Modal
        show={modelOpen}
        onClose={() => {
          setModalBool(false);
        }}
      >
        <Box pa="m">
          <h3>Modal Content</h3>
        </Box>
      </Modal>

      <Button
        variant="secondary-outline"
        width="225px"
        onClick={() => {
          setModalBool(true);
        }}
      >
        <Flex alignItems="center">
          <TrezorLogo />
          <span style={{ margin: 'auto' }}>{lang.landing_page.trezor}</span>
        </Flex>
      </Button>
    </>
  );
}

export default TrezorConnect;
