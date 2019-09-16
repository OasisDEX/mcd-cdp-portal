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
        <Dev />
      </Box>
    );
  }, [system, feeds]);
};

export default SidebarGlobalPanel;

const Dev = () => {
  const [, dispatch] = useStore();

  window.randomizeEthPrice = () => {
    const num = Math.round(Math.random() * 50) + 100;
    const value = num.toString() + '000000000000000000000000000';
    dispatch({
      type: 'watcherUpdates',
      payload: [{ type: 'ilk.ETH-A.priceWithSafetyMargin', value }]
    });
  };

  window.updateCdps = () => {
    dispatch({ type: 'cdps/FETCHED_CDPS', payload: { cdps: [] } });
  };

  return null;
};
