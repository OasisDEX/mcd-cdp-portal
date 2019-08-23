import React, { useState } from 'react';
import { Box, Text, Card, Button, Grid } from '@makerdao/ui-components-core';

import lang from 'languages';
import ScreenFooter from './ScreenFooter';
import useMaker from 'hooks/useMaker';
import useBlockHeight from 'hooks/useBlockHeight';

import { ReactComponent as Checkmark } from 'images/checkmark.svg';

const SuccessButton = () => {
  return (
    <Button variant="primary-outline" width="13.0rem" mt="xs" disabled>
      <Checkmark />
    </Button>
  );
};

const CDPCreateSetAllowance = ({
  selectedIlk,
  proxyAddress,
  hasAllowance,
  dispatch
}) => {
  const { maker } = useMaker();
  const blockHeight = useBlockHeight(0);
  const [startingBlockHeight, setStartingBlockHeight] = useState(0);
  const [proxyDeployed, setProxyDeployed] = useState(false);
  const [isDeployingProxy, setIsDeployingProxy] = useState(false);
  const [isSettingAllowance, setIsSettingAllowance] = useState(false);

  async function deployProxy() {
    setIsDeployingProxy(true);
    try {
      const promise = maker.service('proxy').ensureProxy();
      const proxyAddress = await promise;
      setStartingBlockHeight(blockHeight);
      await maker.service('transactionManager').confirm(promise, 7);
      setProxyDeployed(true);
      dispatch({
        type: 'set-proxy-address',
        payload: { address: proxyAddress }
      });
    } catch (err) {}
    setIsDeployingProxy(false);
  }

  async function setAllowance() {
    setIsSettingAllowance(true);
    try {
      const gemToken = maker.getToken(selectedIlk.currency.symbol);
      await gemToken.approveUnlimited(proxyAddress);
      dispatch({ type: 'set-ilk-allowance', payload: { hasAllowance: true } });
    } catch (err) {}
    setIsSettingAllowance(false);
  }

  return (
    <Box maxWidth="71.8rem">
      <Text.h2 textAlign="center" mb="xl">
        {lang.cdp_create.setup_proxy_title}
      </Text.h2>
      <Card px="2xl" py="l" mb="xl">
        <Grid gridRowGap="xs">
          <Text.h4>Deploy proxy</Text.h4>
          <Text.p color="darkLavender" fontSize="l" lineHeight="normal">
            {lang.cdp_create.setup_proxy_proxy_text}
          </Text.p>
          {proxyAddress ? (
            <SuccessButton />
          ) : (
            <Button
              width="13.0rem"
              mt="xs"
              onClick={deployProxy}
              disabled={isDeployingProxy || isSettingAllowance}
              loading={isDeployingProxy}
            >
              {lang.cdp_create.setup_proxy_proxy_button}
            </Button>
          )}
          {isDeployingProxy && (
            <Text.p color="slate.400" fontSize="s" lineHeight="normal">
              WAITING FOR CONFIRMATIONS...{' '}
              {startingBlockHeight === 0
                ? 0
                : blockHeight - startingBlockHeight > 10
                ? 10
                : blockHeight - startingBlockHeight}{' '}
              of 10
            </Text.p>
          )}
          {proxyDeployed && (
            <Text.p color="slate.400" fontSize="s" lineHeight="normal">
              CONFIRMED WITH 10 CONFIRMATIONS
            </Text.p>
          )}
        </Grid>
        <Grid gridRowGap="xs" mt="l">
          <Text.h4>Set allowance</Text.h4>
          <Text.p color="darkLavender" fontSize="l" lineHeight="normal">
            {lang.formatString(
              lang.cdp_create.setup_proxy_allowance_text,
              selectedIlk.currency.symbol
            )}
          </Text.p>
          {hasAllowance ? (
            <SuccessButton />
          ) : (
            <Button
              width="13.0rem"
              mt="xs"
              onClick={setAllowance}
              disabled={isDeployingProxy || isSettingAllowance}
              loading={isSettingAllowance}
            >
              {lang.cdp_create.setup_proxy_allowance_button}
            </Button>
          )}
        </Grid>
      </Card>
      <ScreenFooter
        dispatch={dispatch}
        canGoBack={!isDeployingProxy}
        canProgress={proxyAddress && hasAllowance}
      />
    </Box>
  );
};

export default CDPCreateSetAllowance;
