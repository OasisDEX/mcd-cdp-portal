import React from 'react';

import lang from 'languages';
import styled from 'styled-components';

import { navigation } from '../../index';
import { Button, Flex } from '@makerdao/ui-components';
import { ReactComponent as MetaMaskLogo } from 'images/metamask.svg';
import { mixpanelIdentify } from 'utils/analytics';
import useMaker from 'components/hooks/useMaker';

// hack to get around button padding for now
const MMLogo = styled(MetaMaskLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

async function checkMetaMaskNetwork() {
  return new Promise((res, rej) => {
    if (window.web3) {
      window.web3.version.getNetwork(async (err, _netId) => {
        if (!!err) rej(err);
        else res(parseInt(_netId, 10));
      });
    } else rej('No web3 provider detected, is MetaMask installed?');
  });
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
          const metamaksNetwork = await checkMetaMaskNetwork();
          const connectedNetwork = maker.service('web3').networkId();

          if (metamaksNetwork !== connectedNetwork)
            throw new Error(
              'MetaMask network and url network param do not match'
            );

          const { address: connectedAddress } = await maker.addAccount({
            type: 'browser'
          });

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
