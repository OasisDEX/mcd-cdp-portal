import React, { useEffect, useState } from 'react';
import ProxyAllowanceCheck from 'components/ProxyAllowanceCheck';
import useProxy from 'hooks/useProxy';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useLanguage from 'hooks/useLanguage';
import { useWeb3BlockHeight } from 'hooks/useBlockHeight';
import { Loader, Flex, Text, Grid } from '@makerdao/ui-components-core';
import styled, { keyframes } from 'styled-components';
import { getColor } from 'styles/theme';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;
const GridFade = styled(Grid)`
  animation: ${props => (props.fade ? fadeOut : fadeIn)} 1000ms linear;
  transition: visibility 1000ms linear;
`;

const Loading = () => (
  <Flex
    gridRowGap="l"
    p="m"
    maxWidth="100%"
    height="500px"
    alignItems="center"
    justifyContent="center"
  >
    <Flex py="m" justifyContent="center">
      <Loader size="4rem" color={getColor('spinner')} bg="#fff" />
    </Flex>
  </Flex>
);

function ProxyAllowanceStepper({ children, token, title, description }) {
  const { lang } = useLanguage();
  const blockHeight = useWeb3BlockHeight(0);

  const displayToken = token === 'MDAI' ? 'DAI' : token;

  const {
    proxyAddress,
    setupProxy,
    proxyLoading,
    startingBlockHeight,
    proxyDeployed,
    proxyErrors,
    hasProxy,
    startedWithoutProxy
  } = useProxy();

  const labels = {
    setup_text: lang.cdp_create.setup_proxy_proxy_text,
    setup_header: lang.cdp_create.setup_vault,
    allowance_text: lang.formatString(
      lang.cdp_create.setup_proxy_allowance_text,
      displayToken
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

  const {
    allowance,
    hasAllowance,
    setAllowance,
    allowanceLoading: isSettingAllowance,
    startedWithoutAllowance
  } = useTokenAllowance(token);

  const loadingState =
    proxyAddress === undefined || (token !== 'ETH' && allowance === undefined);

  const [transitionFlow, setTransitionFlow] = useState(null);
  useEffect(() => {
    let timer;
    if (
      (startedWithoutAllowance || startedWithoutProxy) &&
      hasProxy &&
      hasAllowance
    ) {
      setTransitionFlow(true);
      timer = setTimeout(() => {
        setTransitionFlow(false);
      }, 1000);
    }
    return () => {
      setTransitionFlow(false);
      clearTimeout(timer);
    };
  }, [startedWithoutAllowance, startedWithoutProxy, hasProxy, hasAllowance]);

  const ProxyAllowanceSection = () => (
    <div data-testid="proxy-allowance-form">
      <Text.h4 color="darkLavender">{title}</Text.h4>
      <Text.p t="body" my="s">
        {lang.formatString(
          lang.step_n_of_m,
          '1',
          '2',
          lang.action_sidebar.proxy_allowance_permission
        )}
      </Text.p>
      <ProxyAllowanceCheck
        isSidebar={true}
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
    </div>
  );

  return loadingState ? (
    <Loading />
  ) : !hasProxy || !hasAllowance ? (
    <Grid gridRowGap="s">
      <ProxyAllowanceSection />
    </Grid>
  ) : startedWithoutAllowance || startedWithoutProxy ? (
    transitionFlow ? (
      <GridFade gridRowGap="s" fade={true}>
        <ProxyAllowanceSection />
      </GridFade>
    ) : (
      <GridFade gridRowGap="s" fade={false}>
        <Text.h4 color="darkLavender">{title}</Text.h4>
        <Text.p t="body" my="s">
          {lang.formatString(lang.step_n_of_m, '2', '2', description)}
        </Text.p>
        {children}
      </GridFade>
    )
  ) : (
    <Grid gridRowGap="s">
      <Text.h4 color="darkLavender">{title}</Text.h4>
      <Text.p t="body" my="s">
        {description}
      </Text.p>
      {children}
    </Grid>
  );
}

export default ProxyAllowanceStepper;
