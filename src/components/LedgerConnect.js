import React, { memo, Fragment } from 'react';

import lang from 'languages';
import styled from 'styled-components';

import { Button, Flex } from '@makerdao/ui-components-core';
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

export const StyledBlurb = styled.div`
  line-height: 22px;
  font-size: 17px;
  margin: 22px 0px 16px 0px;
`;

export const StyledTop = styled.div`
  display: flex;
  justify-content: center;
`;

const LedgerConnect = memo(function() {
  const { showByType } = useModal();

  return (
    <Fragment>
      <Button
        variant="secondary-outline"
        width="225px"
        onClick={() => showByType('ledgertype')}
      >
        <Flex alignItems="center">
          <StyledLedgerLogo />
          <span style={{ margin: 'auto' }}>
            {lang.landing_page.ledger_nano}
          </span>
        </Flex>
      </Button>
    </Fragment>
  );
});

export default LedgerConnect;
