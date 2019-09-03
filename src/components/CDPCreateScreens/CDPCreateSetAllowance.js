import React, { useState } from 'react';
import {
  Box,
  Text,
  Card,
  Button,
  Grid,
  Tooltip
} from '@makerdao/ui-components-core';

import lang from 'languages';
import ScreenFooter from './ScreenFooter';
import useMaker from 'hooks/useMaker';
import useBlockHeight from 'hooks/useBlockHeight';
import useTokenAllowance from 'hooks/useTokenAllowance';

import { ReactComponent as Checkmark } from 'images/checkmark.svg';
import TooltipContents from 'components/TooltipContents';

const SuccessButton = () => {
  return (
    <Button variant="primary-outline" width="13.0rem" mt="xs" disabled>
      <Checkmark />
    </Button>
  );
};

const CDPCreateSetAllowance = ({ selectedIlk, proxyAddress, dispatch }) => {
  const { maker } = useMaker();
  const blockHeight = useBlockHeight(0);
  const [startingBlockHeight, setStartingBlockHeight] = useState(0);
  const [proxyDeployed, setProxyDeployed] = useState(false);
  const {
    hasAllowance,
    setAllowance,
    allowanceLoading: isSettingAllowance
  } = useTokenAllowance(selectedIlk.currency.symbol);

  const [isDeployingProxy, setIsDeployingProxy] = useState(false);

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

  return (
    <Box maxWidth="71.8rem">
      <Text.h2 textAlign="center" mb="xl">
        {lang.cdp_create.setup_proxy_title}
      </Text.h2>
      <Card px={{ s: 'l', m: '2xl' }} py="l" mb="xl">
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
          <Text.p t="subheading" lineHeight="normal">
            {isDeployingProxy &&
              lang.formatString(
                lang.cdp_create.waiting_for_comfirmations,
                startingBlockHeight === 0
                  ? 0
                  : blockHeight - startingBlockHeight > 10
                  ? 10
                  : blockHeight - startingBlockHeight,
                10
              )}
            {proxyDeployed &&
              lang.formatString(
                lang.cdp_create.confirmed_with_confirmations,
                10
              )}
            {(isDeployingProxy || proxyDeployed) && (
              <Tooltip
                fontSize="m"
                ml="2xs"
                content={
                  <TooltipContents>
                    {lang.cdp_create.waiting_for_confirmations_info}
                  </TooltipContents>
                }
              />
            )}
          </Text.p>
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
        onNext={() => dispatch({ type: 'increment-step' })}
        onBack={() => dispatch({ type: 'decrement-step' })}
        canGoBack={!isDeployingProxy}
        canProgress={proxyAddress && hasAllowance}
      />
    </Box>
  );
};

export default CDPCreateSetAllowance;
