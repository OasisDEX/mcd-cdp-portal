import React from 'react';
import { Box, Text } from '@makerdao/ui-components-core';
import ScreenFooter from '../ScreenFooter';
import { mixpanelFactory } from 'utils/analytics';
import useProxy from 'hooks/useProxy';
import ProxyAllowanceCheck from '../ProxyAllowanceCheck';
import useBlockHeight from 'hooks/useBlockHeight';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useLanguage from 'hooks/useLanguage';

const { trackBtnClick } = mixpanelFactory(
  'Borrow',
  'VaultCreate',
  'ProxyDeploy'
);

const CDPCreateSetAllowance = ({ selectedIlk, isFirstVault, dispatch }) => {
  const { lang } = useLanguage();
  const blockHeight = useBlockHeight(0);

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
  } = useTokenAllowance(selectedIlk.currency.symbol);

  async function deployProxy() {
    await setupProxy();
    dispatch({
      type: 'set-proxy-address',
      payload: { address: proxyAddress }
    });
  }

  const labels = {
    setup_text: lang.cdp_create.setup_proxy_proxy_text,
    setup_header: lang.cdp_create.setup_vault,
    allowance_text: lang.formatString(
      lang.cdp_create.setup_proxy_allowance_text,
      selectedIlk.currency.symbol
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
        deployProxy={deployProxy}
        labels={labels}
        proxyLoading={proxyLoading}
        proxyDeployed={proxyDeployed}
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
