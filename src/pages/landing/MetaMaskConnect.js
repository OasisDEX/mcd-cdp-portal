import React, { useContext } from 'react';

import lang from 'languages';
import styled from 'styled-components';

import { NavHistory } from 'react-navi';
import { Button, Flex } from '@makerdao/ui-components';
import { MakerAuthContext } from 'components/context/MakerAuth';
import { ReactComponent as MetaMaskLogo } from 'images/metamask.svg';
import { mixpanelIdentify } from 'utils/analytics';
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
        const { address } = await maker.addAccount({ type: 'browser' });
        mixpanelIdentify(address, 'metamask');
        history.push({
          pathname: '/overview/',
          search: `?address=${address}`
        });
      }}
    >
      <Flex alignItems="center">
        <MMLogo />
        <span style={{ margin: 'auto' }}>{lang.landing_page.metamask}</span>
      </Flex>
    </Button>
  );
}

export default function() {
  return (
    <NavHistory>{history => <MetaMaskConnect history={history} />}</NavHistory>
  );
}
