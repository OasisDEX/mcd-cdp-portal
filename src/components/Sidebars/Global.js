import React, { useMemo } from 'react';
import SidebarFeeds from 'components/SidebarFeeds';
import SidebarSystem from 'components/SidebarSystem';
import SidebarDetails from 'components/SidebarDetails';
import { Box, Grid } from '@makerdao/ui-components-core';
import { getAllFeeds } from 'reducers/feeds';
import useStore from 'hooks/useStore';
import { useCurrentRoute } from 'react-navi';
import { Routes } from '../../utils/constants';

const SidebarGlobalPanel = () => {
  const [{ system, feeds }] = useStore();
  const { url } = useCurrentRoute();
  const routeIsBorrow = url.pathname.startsWith(`/${Routes.BORROW}`);
  const routeIsSave = url.pathname.startsWith(`/${Routes.SAVE}`);

  return useMemo(() => {
    const uniqueFeeds = getAllFeeds(feeds, [feeds]);

    return (
      <Box>
        <Grid gridRowGap="s">
          {routeIsBorrow && <SidebarFeeds feeds={uniqueFeeds} />}
          {routeIsBorrow && <SidebarSystem system={system} />}
          {routeIsSave && <SidebarDetails system={system} />}
        </Grid>
      </Box>
    );
  }, [feeds, routeIsBorrow, system, routeIsSave]);
};

export default SidebarGlobalPanel;
