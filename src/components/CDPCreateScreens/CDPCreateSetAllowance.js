import React, { useEffect, useState } from 'react';
import { Box, Text, Card, Button, Grid } from '@makerdao/ui-components-core';

import ScreenFooter from './ScreenFooter';
import useMaker from 'hooks/useMaker';
import { MAX_UINT_BN } from 'utils/units';

import { ReactComponent as Checkmark } from 'images/checkmark.svg';

const SuccessButton = () => {
  return (
    <Button variant="primary-outline" width="13.0rem" mt="xs" disabled>
      <Checkmark />
    </Button>
  );
};

const CDPCreateSetAllowance = ({ selectedIlk, dispatch }) => {
  const { maker, account } = useMaker();
  const [loading, setLoading] = useState(true);
  const [isDeployingProxy, setIsDeployingProxy] = useState(false);
  const [isSettingAllowance, setIsSettingAllowance] = useState(false);
  const [proxyAddress, setProxyAddress] = useState('');
  const [hasAllowance, setHasAllowance] = useState(false);

  useEffect(() => {
    const checkProxyAndAllowance = async () => {
      setLoading(true);
      try {
        const proxyAddress = await maker.service('proxy').currentProxy();
        setProxyAddress(proxyAddress);
        if (selectedIlk.currency.symbol !== 'ETH') {
          const gemToken = maker.getToken(selectedIlk.currency.symbol);
          const gemAllowanceSet = (await gemToken.allowance(
            maker.currentAddress(),
            proxyAddress
          )).eq(MAX_UINT_BN);
          setHasAllowance(gemAllowanceSet);
        } else {
          setHasAllowance(true);
        }
      } catch (err) {}
      setLoading(false);
    };

    checkProxyAndAllowance();
  }, [maker, account]);

  async function deployProxy() {
    setIsDeployingProxy(true);
    try {
      const proxyAddress = await maker.service('proxy').ensureProxy();
      setProxyAddress(proxyAddress);
    } catch (err) {}
    setIsDeployingProxy(false);
  }

  async function setAllowance() {
    setIsSettingAllowance(true);
    try {
      const gemToken = maker.getToken(selectedIlk.currency.symbol);
      await gemToken.approveUnlimited(proxyAddress);
      setHasAllowance(true);
    } catch (err) {}
    setIsSettingAllowance(false);
  }

  return (
    <Box maxWidth="71.8rem">
      <Text.h2 textAlign="center" mb="xl">
        Deploy Proxy and Set Allowance
      </Text.h2>
      <Card px="2xl" py="l" mb="xl">
        <Grid gridRowGap="xs">
          <Text.h4>Deploy proxy</Text.h4>
          <Text.p color="darkLavender" fontSize="l" lineHeight="normal">
            Proxies are used in the CDP Portal to bundle multiple transactions
            into one, saving transaction time and gas costs. This only has to be
            done once.
          </Text.p>
          {proxyAddress ? (
            <SuccessButton />
          ) : (
            <Button
              width="13.0rem"
              mt="xs"
              onClick={deployProxy}
              disabled={loading || isDeployingProxy || isSettingAllowance}
              loading={isDeployingProxy}
            >
              Deploy
            </Button>
          )}
        </Grid>
        <Grid gridRowGap="xs" mt="l">
          <Text.h4>Set allowance</Text.h4>
          <Text.p color="darkLavender" fontSize="l" lineHeight="normal">
            This permission allows Maker smart contracts to interact with your
            ETH. This has to be done once for each new collateral type.
          </Text.p>
          {hasAllowance ? (
            <SuccessButton />
          ) : (
            <Button
              width="13.0rem"
              mt="xs"
              onClick={setAllowance}
              disabled={loading || isDeployingProxy || isSettingAllowance}
              loading={isSettingAllowance}
            >
              Set
            </Button>
          )}
        </Grid>
      </Card>
      <ScreenFooter
        dispatch={dispatch}
        canProgress={!loading && proxyAddress && hasAllowance}
      />
    </Box>
  );
};

export default CDPCreateSetAllowance;
