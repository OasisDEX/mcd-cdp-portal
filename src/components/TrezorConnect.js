import React, { Fragment } from 'react';

import lang from 'languages';
import styled from 'styled-components';

import { Button, Modal, Flex, Box } from '@makerdao/ui-components-core';
import { ReactComponent as Logo } from 'images/trezor.svg';

import useMaker from 'hooks/useMaker';
import useModal from 'hooks/useModal';

const TrezorLogo = styled(Logo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

export default function TrezorConnect() {
  const { authenticated: makerAuthenticated } = useMaker();
  const { showByType } = useModal();

  return (
    <Fragment>
      <Button
        variant="secondary-outline"
        width="225px"
        disabled={!makerAuthenticated}
        onClick={() => showByType('trezor')}
      >
        <Flex alignItems="center">
          <TrezorLogo />
          <span style={{ margin: 'auto' }}>{lang.landing_page.trezor}</span>
        </Flex>
      </Button>
    </Fragment>
  );
}
