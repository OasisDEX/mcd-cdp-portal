import React from 'react';
import { Box, Text } from '@makerdao/ui-components-core';
import ScreenFooter from '../ScreenFooter';
import useProxy from 'hooks/useProxy';
import { useWeb3BlockHeight } from 'hooks/useBlockHeight';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useLanguage from 'hooks/useLanguage';
import useAnalytics from 'hooks/useAnalytics';
import ProxyAllowanceCheck from '../ProxyAllowanceCheck';

const CDPCreateSetAllowance = ({ selectedIlk, isFirstVault, dispatch }) => {
  const { trackBtnClick } = useAnalytics('ProxyDeploy', 'VaultCreate');
  const { lang } = useLanguage();
  const blockHeight = useWeb3BlockHeight(0);

  const {
    proxyAddress,
    setupProxy,
    proxyLoading,
    startingBlockHeight,
    proxyDeployed,
    proxyErrors,
    hasProxy
  } = useProxy();

  const {
    hasAllowance,
    setAllowance,
    allowanceLoading: isSettingAllowance
  } = useTokenAllowance(selectedIlk.gem);

  const labels = {
    setup_text: lang.cdp_create.setup_proxy_proxy_text,
    setup_header: lang.cdp_create.setup_vault,
    allowance_text: lang.formatString(
      lang.cdp_create.setup_proxy_allowance_text,
      selectedIlk.gem
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
        {lang.cdp_create.setup_proxy_title}
      </Text.h2>
      <ProxyAllowanceCheck
        proxyAddress={proxyAddress}
        deployProxy={setupProxy}
        labels={labels}
        proxyLoading={proxyLoading}
        proxyDeployed={proxyDeployed}
        hasProxy={hasProxy}
        proxyErrors={proxyErrors}
        setAllowance={setAllowance}
        hasAllowance={hasAllowance}
        isSettingAllowance={isSettingAllowance}
      />
      <ScreenFooter
        onNext={() => {
          trackBtnClick('Next', { isFirstVault });
          dispatch({ type: 'increment-step' });
        }}
        onBack={() => dispatch({ type: 'decrement-step' })}
        canGoBack={!proxyLoading}
        canProgress={hasProxy && hasAllowance}
      />
    </Box>
  );
};

export default CDPCreateSetAllowance;
