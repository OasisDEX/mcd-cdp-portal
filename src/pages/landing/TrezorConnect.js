import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { Button, Modal, Flex } from '@makerdao/ui-components';
import { MakerAuthContext } from 'components/context/MakerAuth';
import { ReactComponent as Logo } from 'images/trezor.svg';

const TrezorLogo = styled(Logo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

const PaddedDiv = styled.div`
  padding: 20px;
`;

function TrezorConnect() {
  const makerAuthenticated = useContext(MakerAuthContext);
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
        disabled={!makerAuthenticated}
        onClick={() => {
          setModalBool(true);
        }}
      >
        <Flex alignItems="center">
          <TrezorLogo />
          <span style={{ margin: 'auto' }}>Trezor</span>
        </Flex>
      </Button>
    </>
  );
}

export default TrezorConnect;
