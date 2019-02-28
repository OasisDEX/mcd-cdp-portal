import React, { useState } from 'react';

import lang from 'languages';

import styled from 'styled-components';

import { Button, Modal } from '@makerdao/ui-components-core';

const CustomButton = styled(Button)`
  height: 30px;
  margin-left: 30px;
  padding: 0px 26px;
`;

const PaddedDiv = styled.div`
  padding: 20px;
`;

export default function AccountConnect() {
  const [modalOpen, setModalBool] = useState(false);

  return (
    <>
      <Modal
        show={modalOpen}
        onClose={() => {
          setModalBool(false);
        }}
      >
        <PaddedDiv>
          <h3>Modal Content</h3>
        </PaddedDiv>
      </Modal>

      <span>{lang.sidebar.read_only_mode}</span>
      <CustomButton
        onClick={() => {
          setModalBool(true);
        }}
        variant="secondary-outline"
      >
        {lang.connect}
      </CustomButton>
    </>
  );
}
