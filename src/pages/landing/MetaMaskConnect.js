import React, { useContext } from 'react';

import lang from 'languages';
import styled from 'styled-components';

import { navigation } from '../../index';
import { Button, Flex } from '@makerdao/ui-components';
import { MakerAuthContext } from 'components/context/MakerAuth';
import { ReactComponent as MetaMaskLogo } from 'images/metamask.svg';
import { mixpanelIdentify } from 'utils/analytics';

import { getMaker } from 'maker';
import config from 'references/config';

const { supportedNetworkIds } = config;

// hack to get around button padding for now
const MMLogo = styled(MetaMaskLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

export default function MetaMaskConnect() {
  const makerAuthenticated = useContext(MakerAuthContext);

  return (
    <Button
      variant="secondary-outline"
      width="225px"
      disabled={!makerAuthenticated}
      onClick={async () => {
        const { address, subprovider } = await getMaker().addAccount({
          type: 'browser'
        });
        const networkId = subprovider.provider.networkVersion;

        if (!supportedNetworkIds.includes(networkId))
          throw new Error(`Unsupported network id: ${networkId}`);

        // TODO: the sdk might be able to provide this ^ in a more natural way
        mixpanelIdentify(address, 'metamask');
        navigation.history.push({
          pathname: '/overview/',
          search: `?address=${address}&networkId=${networkId}`
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
