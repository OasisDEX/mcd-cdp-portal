import React from 'react';
import { Grid } from '@makerdao/ui-components-core';
import useProxy from 'hooks/useProxy';
import useTokenAllowance from 'hooks/useTokenAllowance';
import AllowanceToggle from './AllowanceToggle';
import ProxyToggle from './ProxyToggle';

const ProxyAllowanceToggle = ({ token, onlyShowAllowance = false }) => {
  const {
    hasAllowance,
    hasFetchedAllowance,
    setAllowance,
    allowanceLoading,
    startedWithoutAllowance
  } = useTokenAllowance(token);

  const {
    setupProxy,
    proxyLoading,
    startedWithoutProxy,
    hasProxy,
    initialProxyCheck
  } = useProxy();

  const showToggles =
    !hasProxy ||
    !hasAllowance ||
    startedWithoutProxy ||
    startedWithoutAllowance;
  const showProxy =
    !onlyShowAllowance &&
    !initialProxyCheck &&
    (startedWithoutProxy || proxyLoading || !hasProxy);
  const showAllowance =
    startedWithoutAllowance ||
    allowanceLoading ||
    (hasFetchedAllowance && !hasAllowance);

  const tokenDisplayName =
    token === 'MDAI' ? 'DAI' : token === 'MWETH' ? 'WETH' : token;
  return showToggles ? (
    <Grid gridRowGap="s" data-testid="toggle-container">
      {showProxy && (
        <ProxyToggle
          isLoading={proxyLoading}
          isComplete={!!hasProxy}
          onToggle={setupProxy}
          disabled={!!hasProxy}
          data-testid="proxy-toggle"
        />
      )}
      {showAllowance && (
        <AllowanceToggle
          tokenDisplayName={tokenDisplayName}
          isLoading={allowanceLoading}
          isComplete={hasAllowance}
          onToggle={setAllowance}
          disabled={(!onlyShowAllowance && !hasProxy) || hasAllowance}
          data-testid="allowance-toggle"
        />
      )}
    </Grid>
  ) : (
    <div />
  );
};

export default ProxyAllowanceToggle;
