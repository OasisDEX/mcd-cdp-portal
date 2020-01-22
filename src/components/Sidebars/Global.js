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

  const { url } = useCurrentRoute();
  const routeIsBorrow = url.pathname.startsWith(`/${Routes.BORROW}`);
  const routeIsSave = url.pathname.startsWith(`/${Routes.SAVE}`);

  return useMemo(() => {
    return (
      <Box>
        <Grid gridRowGap="s">
          {routeIsBorrow && <SidebarFeeds feeds={prices} />}
          {routeIsBorrow && <SidebarSystem system={{ totalDaiSupply }} />}
          {routeIsSave && <SidebarDetails system={{ totalDaiSupply }} />}
        </Grid>
      </Box>
    );
  }, [routeIsBorrow, routeIsSave, prices, totalDaiSupply]);
};

export default SidebarGlobalPanel;
