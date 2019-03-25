import React, { useState } from 'react';

import lang from 'languages';

import styled from 'styled-components';

import { Button, Modal, Box } from '@makerdao/ui-components-core';

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
        <Box pa="m">
          <h3>Modal Content</h3>
        </Box>
      </Modal>

      <span>{lang.sidebar.read_only_mode}</span>
      <Button
        onClick={() => {
          setModalBool(true);
        }}
        variant="secondary-outline"
        height="30px"
        ml="30px"
        px="26px"
        py="0px"
      >
        {lang.connect}
      </Button>
    </>
  );
}
