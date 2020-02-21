import React from 'react';
import { Box, Text } from '@makerdao/ui-components-core';
import ScreenFooter from '../ScreenFooter';
import useProxy from 'hooks/useProxy';
import ProxyAllowanceCheck from '../ProxyAllowanceCheck';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useBlockHeight from 'hooks/useBlockHeight';
import useLanguage from 'hooks/useLanguage';

const DSRDepositCheckProxy = ({ dispatch, onClose }) => {
  const { lang } = useLanguage();
  const blockHeight = useBlockHeight(0);

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
    const proxy = await setupProxy();
    dispatch({
      type: 'set-proxy-address',
      payload: { address: proxy }
    });
  }

  const labels = {
    setup_text: lang.dsr_deposit.setup_proxy_text,
    setup_header: lang.dsr_deposit.setup_header,
    allowance_text: lang.formatString(
      lang.cdp_create.setup_proxy_allowance_text,
      'DAI'
    ),
    confirmations_text: lang.formatString(
      lang.cdp_create.waiting_for_comfirmations,
      startingBlockHeight === 0
        ? 0
        : blockHeight - startingBlockHeight > 10
        ? 10
        : blockHeight - startingBlockHeight,
      10
    )
  };

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
        hasProxy={hasProxy}
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
