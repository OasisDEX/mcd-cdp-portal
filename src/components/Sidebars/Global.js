import React from 'react';
import SidebarFeeds from 'components/SidebarFeeds';
import SidebarSystem from 'components/SidebarSystem';
import { Box } from '@makerdao/ui-components-core';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getAllFeeds } from 'reducers/network/cdpTypes';

function mapStateToProps(state) {
  return {
    feeds: getAllFeeds(state),
    system: state.network.system
  };
}

const Section = styled.section`
  padding: 0 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight3};
  box-sizing: content-box;
`;

const SidebarGlobalPanel = ({ feeds, system }) => {
  return (
    <Box>
      <Section>
        <SidebarFeeds feeds={feeds} />
      </Section>
      <Section>
        <SidebarSystem system={system} />
      </Section>
    </Box>
  );
};

export default connect(mapStateToProps)(SidebarGlobalPanel);
