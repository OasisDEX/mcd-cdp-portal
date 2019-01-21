import React, { useContext } from 'react';
import { NavHistory } from 'react-navi';
import styled from 'styled-components';
import { Button, Flex } from '@makerdao/ui-components';
import { MakerAuthContext } from 'components/context/MakerAuth';
import { ReactComponent as MetaMaskLogo } from 'images/metamask.svg';

import maker from 'maker';

// hack to get around button padding for now
const MMLogo = styled(MetaMaskLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

function MetaMaskConnect({ history }) {
  const makerAuthenticated = useContext(MakerAuthContext);

  return (
    <Button
      variant="secondary-outline"
      width="225px"
      disabled={!makerAuthenticated}
      onClick={async () => {
        const account = await maker.addAccount({ type: 'browser' });
        history.push({
          pathname: '/overview',
          search: `?address=${account.address}`
        });
      }}
    >
      <Flex alignItems="center">
        <MMLogo />
        <span style={{ margin: 'auto' }}>MetaMask</span>
      </Flex>
    </Button>
  );
}

export default function() {
  return (
    <NavHistory>{history => <MetaMaskConnect history={history} />}</NavHistory>
  );
}
