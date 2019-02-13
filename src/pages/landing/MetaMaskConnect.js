import React from 'react';

import lang from 'languages';
import styled from 'styled-components';

import { navigation } from '../../index';
import { Button, Flex } from '@makerdao/ui-components-core';
import { ReactComponent as MetaMaskLogo } from 'images/metamask.svg';
import { mixpanelIdentify } from 'utils/analytics';
import useMaker from 'components/hooks/useMaker';

// hack to get around button padding for now
const MMLogo = styled(MetaMaskLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

async function checkEthereumProvider() {
  return new Promise(async (res, rej) => {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.enable();
      const { selectedAddress, networkVersion } = window.ethereum;
      res({
        networkId: parseInt(networkVersion, 10),
        address: selectedAddress
      });
    } else rej('No web3 provider detected');
  });
}

function makerIsAlreadyConnected(maker, provider) {
  return (
    maker.service('accounts').hasAccount() &&
    !!provider.address &&
    provider.address === maker.currentAddress()
  );
}

export default function MetaMaskConnect() {
  const { maker, authenticated: makerAuthenticated } = useMaker();

  return (
    <Button
      variant="secondary-outline"
      width="225px"
      disabled={!makerAuthenticated}
      onClick={async () => {
        try {
          const browserProvider = await checkEthereumProvider();
          const connectedNetworkId = maker.service('web3').networkId();

          if (browserProvider.networkId !== connectedNetworkId)
            throw new Error(
              'browser ethereum provider and URL network param do not match.'
            );

          if (!makerIsAlreadyConnected(maker, browserProvider))
            await maker.addAccount({
              type: 'browser'
            });

          const connectedAddress = maker.currentAddress();

          mixpanelIdentify(connectedAddress, 'metamask');

          const {
            network,
            address: urlParamAddress
          } = navigation.receivedRoute.url.query;

          const addressToView = urlParamAddress || connectedAddress;
          navigation.history.push({
            pathname: '/overview/',
            search: `?network=${network}&address=${addressToView}`
          });
        } catch (err) {
          window.alert(err.toString());
        }
      }}
    >
      <Flex alignItems="center">
        <MMLogo />
        <span style={{ margin: 'auto' }}>{lang.landing_page.metamask}</span>
      </Flex>
    </Button>
  );
}
