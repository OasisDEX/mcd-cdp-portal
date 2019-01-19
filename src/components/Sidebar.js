import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getAllFeeds } from 'reducers/network/cdpTypes';

import SidebarDashboard from './sidebar/Dashboard';

// TODO: Use theme variables
const StyledSidebar = styled.aside`
  min-height: 1000px;
  background: #fff;
  box-shadow: -1px 0px 3px rgba(159, 159, 159, 0.25);
`;

function Sidebar(props) {
  return (
    <StyledSidebar>
      <SidebarDashboard {...props} />
    </StyledSidebar>
  );
}

function mapStateToProps(state) {
  return {
    feeds: getAllFeeds(state),
    system: state.network.system
  };
}

export default connect(mapStateToProps)(Sidebar);
