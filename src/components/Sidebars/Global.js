import React, { useMemo } from 'react';
import SidebarFeeds from 'components/SidebarFeeds';
import SidebarSystem from 'components/SidebarSystem';
import SidebarDetails from 'components/SidebarDetails';
import { Box, Grid } from '@makerdao/ui-components-core';
import { useCurrentRoute } from 'react-navi';
import { Routes } from 'utils/constants';
import useCdpTypes from 'hooks/useCdpTypes';
import { watch } from 'hooks/useObservable';

const SidebarGlobalPanel = () => {
  const { cdpTypesList } = useCdpTypes();
  const prices = watch.collateralTypesPrices(cdpTypesList);
  const totalDaiSupply = watch.totalDaiSupply();
  const totalVaultsCreated = watch.vaultsCreated();
  const totalDaiLockedInDsr = watch.totalDaiLockedInDsr();
  const annualDaiSavingsRate = watch.annualDaiSavingsRate();
  const systemCollateralization = watch.systemCollateralization(cdpTypesList);

  const { url } = useCurrentRoute();
  const routeIsBorrow = url.pathname.startsWith(`/${Routes.BORROW}`);
  const routeIsSave = url.pathname.startsWith(`/${Routes.SAVE}`);

  return useMemo(() => {
    return (
      <Box>
        <Grid gridRowGap="s">
          {routeIsBorrow && <SidebarFeeds feeds={prices} />}
          {routeIsBorrow && (
            <SidebarSystem
              system={{
                totalDaiSupply,
                totalVaultsCreated,
                systemCollateralization
              }}
            />
          )}
          {routeIsSave && (
            <SidebarDetails
              system={{
                totalDaiSupply,
                totalDaiLockedInDsr,
                annualDaiSavingsRate
              }}
            />
          )}
        </Grid>
      </Box>
    );
  }, [
    routeIsBorrow,
    routeIsSave,
    prices,
    totalDaiSupply,
    totalVaultsCreated,
    totalDaiLockedInDsr,
    annualDaiSavingsRate,
    systemCollateralization
  ]);
};

export default SidebarGlobalPanel;
