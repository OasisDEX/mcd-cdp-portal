import React, { useMemo } from 'react';
import SidebarFeeds from 'components/SidebarFeeds';
import SidebarSystem from 'components/SidebarSystem';
import { Box, Grid } from '@makerdao/ui-components-core';
import getPrices from '../../reducers/selectors/getPrices';
import useStore from 'hooks/useStore';
import { ETH } from '@makerdao/dai-plugin-mcd';

const SidebarGlobalPanel = () => {
  const [{ system, ilks }] = useStore();
  return useMemo(() => {
    const feeds = getPrices({ ilks });

    return (
      <Box>
        <Grid gridRowGap="s">
          <SidebarFeeds feeds={feeds} />
          <SidebarSystem system={system} />
        </Grid>
        <Dev />
      </Box>
    );
  }, [system, ilks]);
};

export default SidebarGlobalPanel;

const Dev = () => {
  const [, dispatch] = useStore();

  window.randomizeEthPrice = () => {
    const num = 200 + Math.random() * 50;
    dispatch({ type: 'ETH.price', value: ETH(num) });
  };

  window.updateCdps = () => {
    dispatch({ type: 'cdps/FETCHED_CDPS', payload: { cdps: [] } });
  };

  return null;
};
