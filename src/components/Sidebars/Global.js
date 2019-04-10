import React from 'react';
import SidebarFeeds from 'components/SidebarFeeds';
import SidebarSystem from 'components/SidebarSystem';
import { Box, Grid } from '@makerdao/ui-components-core';
import { connect } from 'react-redux';
import { getAllFeeds } from 'reducers/network/cdpTypes';

function mapStateToProps(state) {
  return {
    feeds: getAllFeeds(state),
    system: state.network.system
  };
}

const SidebarGlobalPanel = ({ feeds, system }) => {
  return (
    <Box>
      <Grid gridRowGap="s">
        <SidebarFeeds feeds={feeds} />
        <SidebarSystem system={system} />
      </Grid>
    </Box>
  );
};

export default connect(mapStateToProps)(SidebarGlobalPanel);
