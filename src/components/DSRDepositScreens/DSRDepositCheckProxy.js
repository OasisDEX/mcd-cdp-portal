import React from 'react';
import { Box, Text } from '@makerdao/ui-components-core';

import lang from 'languages';
import ScreenFooter from './ScreenFooter';
import useProxy from 'hooks/useProxy';

import ProxyAllowanceCheck from '../ProxyAllowanceCheck';
import useTokenAllowance from 'hooks/useTokenAllowance';

const DSRDepositCheckProxy = ({ dispatch, onClose }) => {
  // const symbol = 'MDAI';
  const labels = {
    setup_text: lang.dsr_deposit.setup_proxy_text,
    allowance_text: lang.formatString(
      lang.cdp_create.setup_proxy_allowance_text,
      'DAI'
    )
  };
  const {
    proxyLoading,
    hasProxy,
    proxyAddress,
    proxyDeployed,
    setupProxy,
    startingBlockHeight,
    proxyErrors
  } = useProxy();

  const {
    hasAllowance,
    setAllowance,
    allowanceLoading: isSettingAllowance
  } = useTokenAllowance('MDAI');

  async function deployProxy() {
    await setupProxy();
    dispatch({
      type: 'set-proxy-address',
      payload: { address: proxyAddress }
    });
  }

  return (
    <Box maxWidth="71.8rem">
      <Text.h2 textAlign="center" mb="xl">
        {lang.dsr_deposit.open_vault}
      </Text.h2>
      <ProxyAllowanceCheck
        proxyAddress={proxyAddress}
        deployProxy={deployProxy}
        labels={labels}
        proxyLoading={proxyLoading}
        proxyDeployed={proxyDeployed}
        proxyErrors={proxyErrors}
        startingBlockHeight={startingBlockHeight}
        setAllowance={setAllowance}
        hasAllowance={hasAllowance}
        isSettingAllowance={isSettingAllowance}
      />
      <ScreenFooter
        onNext={() => dispatch({ type: 'increment-step' })}
        onBack={onClose}
        canGoBack={!proxyLoading}
        canProgress={hasProxy && hasAllowance}
      />
    </Box>
  );
};

export default DSRDepositCheckProxy;
