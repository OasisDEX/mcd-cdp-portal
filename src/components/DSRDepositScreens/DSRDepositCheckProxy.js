import React from 'react';
import { Box, Text } from '@makerdao/ui-components-core';

import lang from 'languages';
import ScreenFooter from './ScreenFooter';
import useProxy from 'hooks/useProxy';

import ProxyAllowanceCheck from '../ProxyAllowanceCheck';

const DSRDepositCheckProxy = ({ dispatch, onClose }) => {
  const symbol = 'MDAI';
  const labels = {
    setup_text: lang.dsr_deposit.setup_proxy_text
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

  console.log(
    '%%1PALuseProxy vals: proxyAddress,proxyLoading,startingBlockHeight,proxyDeployed, proxyErrors',
    proxyAddress,
    // setupProxy,
    proxyLoading,
    startingBlockHeight,
    proxyDeployed,
    proxyErrors
  );

  //TODO add hasAllowance to canProgress

  return (
    <Box maxWidth="71.8rem">
      <Text.h2 textAlign="center" mb="xl">
        {lang.dsr_deposit.open_vault}
      </Text.h2>
      <ProxyAllowanceCheck
        symbol={symbol}
        labels={labels}
        dispatch={dispatch}
      />
      <ScreenFooter
        onNext={() => dispatch({ type: 'increment-step' })}
        onBack={onClose}
        canGoBack={!proxyLoading}
        canProgress={hasProxy}
      />
    </Box>
  );
};

export default DSRDepositCheckProxy;
