import React from 'react';

import lang from 'languages';
import styled from 'styled-components';

import { useNavigation } from 'react-navi';
import { Button, Flex } from '@makerdao/ui-components-core';
import { ReactComponent as MetaMaskLogo } from 'images/metamask.svg';
import useMaker from 'hooks/useMaker';

// hack to get around button padding for now
const MMLogo = styled(MetaMaskLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

export default function MetaMaskConnect() {
  const { authenticated: makerAuthenticated, connectMetamask } = useMaker();
  const navigation = useNavigation();

  return (
    <Button
      variant="secondary-outline"
      width="225px"
      disabled={!makerAuthenticated}
      onClick={async () => {
        const connectedAddress = await connectMetamask();

        const {
          network,
          testchainId
        } = (await navigation.getRoute()).url.query;

        navigation.navigate({
          pathname: `owner/${connectedAddress}`,
          search:
            testchainId !== undefined
              ? `?testchainId=${testchainId}`
              : `?network=${network}`
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
