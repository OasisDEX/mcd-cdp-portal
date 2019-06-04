import React, { useMemo } from 'react';
import SidebarFeeds from 'components/SidebarFeeds';
import SidebarSystem from 'components/SidebarSystem';
import { Box, Grid } from '@makerdao/ui-components-core';
import { getAllFeeds } from 'reducers/feeds';
import useStore from 'hooks/useStore';
import { ETH } from '@makerdao/dai-plugin-mcd';

const SidebarGlobalPanel = () => {
  const [{ system, feeds }] = useStore();
  return useMemo(() => {
    const uniqueFeeds = getAllFeeds(feeds, [feeds]);

    /* Mocking extra feed data */
    const dummyFeeds = [
      ...uniqueFeeds,
      ...uniqueFeeds,
      ...uniqueFeeds,
      ...uniqueFeeds
    ].map((feed, idx) => {
      if (idx < 2) return feed;
      return { pair: `DUM${idx - 1}/USD`, value: feed.value };
    });

    return (
      <Box>
        <Grid gridRowGap="s">
          <SidebarFeeds feeds={dummyFeeds} />
          <SidebarSystem system={system} />
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
    const num = 200 + Math.random() * 50;
    dispatch({ type: 'ETH.feedValueUSD', value: ETH(num) });
  };

  window.updateCdps = () => {
    dispatch({ type: 'cdps/FETCHED_CDPS', payload: { cdps: [] } });
  };

  return null;
};
