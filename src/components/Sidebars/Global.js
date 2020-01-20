import React, { useMemo } from 'react';
import SidebarFeeds from 'components/SidebarFeeds';
import SidebarSystem from 'components/SidebarSystem';
import SidebarDetails from 'components/SidebarDetails';
import { Box, Grid } from '@makerdao/ui-components-core';
import { useCurrentRoute } from 'react-navi';
import { Routes } from '../../utils/constants';
import useCdpTypes from 'hooks/useCdpTypes';
import { watch } from 'hooks/useObservable';

const SidebarGlobalPanel = () => {
  const { cdpTypesList } = useCdpTypes();
  const { totalDaiSupply } = watch.totalDaiSupply();
  const { ilkPrices } = watch.ilkPrices(cdpTypesList);
  const { url } = useCurrentRoute();

  const routeIsBorrow = url.pathname.startsWith(`/${Routes.BORROW}`);
  const routeIsSave = url.pathname.startsWith(`/${Routes.SAVE}`);

  return useMemo(() => {
    return (
      <Box>
        <Grid gridRowGap="s">
          {routeIsBorrow && <SidebarFeeds feeds={ilkPrices} />}
          {routeIsBorrow && <SidebarSystem system={{ totalDaiSupply }} />}
          {routeIsSave && <SidebarDetails system={{ totalDaiSupply }} />}
        </Grid>
      </Box>
    );
  }, [ilkPrices, routeIsBorrow, totalDaiSupply, routeIsSave]);
};

export default SidebarGlobalPanel;
