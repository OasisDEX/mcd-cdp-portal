import React, { useMemo } from 'react';
import SidebarFeeds from 'components/SidebarFeeds';
import SidebarSystem from 'components/SidebarSystem';
import SidebarDetails from 'components/SidebarDetails';
import { Box, Grid } from '@makerdao/ui-components-core';
import { useCurrentRoute } from 'react-navi';
import { Routes } from '../../utils/constants';
import useObservable from 'hooks/useObservable';
import useCdpTypes from 'hooks/useCdpTypes';

const SidebarGlobalPanel = () => {
  const { cdpTypesList } = useCdpTypes();
  const { totalDaiSupply } = useObservable('totalDaiSupply');
  const { ilkPrices } = useObservable('ilkPrices', cdpTypesList);
  const { url } = useCurrentRoute();
  const routeIsBorrow = url.pathname.startsWith(`/${Routes.BORROW}`);
  const routeIsSave = url.pathname.startsWith(`/${Routes.SAVE}`);
  const feeds = ilkPrices ? ilkPrices : [];

  return useMemo(() => {
    return (
      <Box>
        <Grid gridRowGap="s">
          {routeIsBorrow && <SidebarFeeds feeds={feeds} />}
          {routeIsBorrow && <SidebarSystem system={{ totalDaiSupply }} />}
          {routeIsSave && <SidebarDetails system={{ totalDaiSupply }} />}
        </Grid>
      </Box>
    );
  }, [feeds, routeIsBorrow, totalDaiSupply, routeIsSave]);
};

export default SidebarGlobalPanel;
