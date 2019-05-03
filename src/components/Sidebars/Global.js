import React, { useState, useMemo } from 'react';
import SidebarFeeds from 'components/SidebarFeeds';
import SidebarSystem from 'components/SidebarSystem';
import { Box, Grid } from '@makerdao/ui-components-core';
import { getAllFeeds } from 'reducers/feeds';
import useStore from 'hooks/useStore';

const SidebarGlobalPanel = () => {
  const [uniqueFeeds, setUniqueFeeds] = useState([]);
  const [{ system, feeds }] = useStore();
  useMemo(() => {
    setUniqueFeeds(getAllFeeds(feeds));
  }, [feeds]);

  return (
    <Box>
      <Grid gridRowGap="s">
        <SidebarFeeds feeds={uniqueFeeds} />
        <SidebarSystem system={system} />
      </Grid>
    </Box>
  );
};

export default SidebarGlobalPanel;
