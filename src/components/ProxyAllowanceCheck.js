import React from 'react';
import {
  Text,
  Card,
  Button,
  Grid,
  Tooltip
} from '@makerdao/ui-components-core';

import lang from 'languages';
import useBlockHeight from 'hooks/useBlockHeight';
import useProxy from 'hooks/useProxy';
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

const ProxyAllowanceCheck = ({ symbol, labels, dispatch }) => {
  const blockHeight = useBlockHeight(0);
  const { setup_text } = labels;

  const {
    proxyAddress,
    setupProxy,
    proxyLoading,
    startingBlockHeight,
    proxyDeployed,
    proxyErrors
  } = useProxy();

  const {
    hasAllowance,
    setAllowance,
    allowanceLoading: isSettingAllowance
  } = useTokenAllowance(symbol);

  async function deployProxy() {
    await setupProxy();
    dispatch({
      type: 'set-proxy-address',
      payload: { address: proxyAddress }
    });
  }

  console.log(
    '%%2PALuseProxy vals: proxyAddress,proxyLoading,startingBlockHeight,proxyDeployed, proxyErrors',
    proxyAddress,
    proxyLoading,
    startingBlockHeight,
    proxyDeployed,
    proxyErrors
  );

  return (
    <Card px={{ s: 'l', m: '2xl' }} py="l" mb="xl">
      <Grid gridRowGap="xs">
        <Text.h4>Deploy proxy</Text.h4>
        <Text.p color="darkLavender" fontSize="l" lineHeight="normal">
          {setup_text}
        </Text.p>
        {proxyAddress ? (
          <SuccessButton />
        ) : (
          <Button
            width="13.0rem"
            mt="xs"
            onClick={deployProxy}
            disabled={proxyLoading || isSettingAllowance || !!proxyErrors}
            loading={proxyLoading || !!proxyErrors}
          >
            {lang.cdp_create.setup_proxy_proxy_button}
          </Button>
        )}
        <Text.p t="subheading" lineHeight="normal">
          {proxyErrors && (
            <>
              {lang.cdp_create.proxy_failure_not_mined}
              <Tooltip
                fontSize="m"
                ml="2xs"
                content={
                  <TooltipContents>
                    {lang.cdp_create.proxy_failure_not_mined_info}
                  </TooltipContents>
                }
              />
            </>
          )}
          {proxyLoading &&
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
            lang.formatString(lang.cdp_create.confirmed_with_confirmations, 10)}
          {(proxyLoading || proxyDeployed) && (
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
            symbol
          )}
        </Text.p>
        {hasAllowance ? (
          <SuccessButton />
        ) : (
          <Button
            width="13.0rem"
            mt="xs"
            onClick={setAllowance}
            disabled={!proxyAddress || proxyLoading || isSettingAllowance}
            loading={isSettingAllowance}
          >
            {lang.cdp_create.setup_proxy_allowance_button}
          </Button>
        )}
      </Grid>
    </Card>
  );
};

export default ProxyAllowanceCheck;
