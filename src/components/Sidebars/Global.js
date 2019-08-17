import React, { useMemo } from 'react';
import SidebarFeeds from 'components/SidebarFeeds';
import SidebarSystem from 'components/SidebarSystem';
import { Box, Grid } from '@makerdao/ui-components-core';
import useFeeds from 'hooks/useFeeds';
import useSystemInfo from 'hooks/useSystemInfo';

const SidebarGlobalPanel = () => {
  const feeds = useFeeds();
  const system = useSystemInfo();

  return useMemo(() => {
    return (
      <Box>
        <Grid gridRowGap="s">
          <SidebarFeeds feeds={feeds} />
          <SidebarSystem system={system} />
        </Grid>
        <Dev />
      </Box>
    );
  }, [system, feeds]);
};

export default SidebarGlobalPanel;

const Dev = () => {
  // const [, dispatch] = useStore();

  // window.randomizeEthPrice = () => {
  //   const num = Math.round(Math.random() * 50) + 100;
  //   const value = num.toString() + '000000000000000000000000000';
  //   dispatch({
  //     type: 'watcherUpdates',
  //     payload: [{ type: 'ilk.ETH-A.priceWithSafetyMargin', value }]
  //   });
  // };

  // window.updateCdps = () => {
  //   dispatch({ type: 'cdps/FETCHED_CDPS', payload: { cdps: [] } });
  // };

  return null;
};
