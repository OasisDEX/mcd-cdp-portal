import React, { Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getAllFeeds } from 'reducers/network/cdpTypes';

import { Flex, Text } from '@makerdao/ui-components-core';
import Jazzicon from './Jazzicon';
import { cutMiddle } from 'utils/ui';
import { getColor } from 'styles/theme';
import SidebarFeeds from './SidebarFeeds';
import SidebarSystem from './SidebarSystem';
import AccountConnect from './SidebarAccountConnect';
import config from 'references/config';

const { networkDisplayNames } = config;

const Section = styled.section`
  padding: 0 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight3};
  box-sizing: content-box;
`;

const Header = styled(Section)`
  height: 50px;
  margin-top: 1px;
`;

const Network = styled(Section)`
  padding-top: ${({ theme }) => theme.space.xs};
  padding-bottom: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.black3};
`;

const Dot = styled.span`
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  margin: 0 1rem 0 0.2rem;
  background: ${({ color }) => color || '#000'};
`;

const StyledAddress = styled(Text)`
  color: ${({ theme }) => theme.colors.black2};
  margin: 0 14px;
`;

const NETWORK_COLORS = {
  1: getColor('greenPastel'),
  42: getColor('purple'),
  999: getColor('black')
};

function netIdToDisplayName(networkId) {
  const displayName = networkDisplayNames[networkId];
  if (displayName !== undefined) return displayName;
  return 'Unkown network';
}

function NetworkSection({ networkID }) {
  const networkDisplayName = netIdToDisplayName(networkID);
  return (
    <Network py="xs" color="black3">
      <Dot color={NETWORK_COLORS[networkID]} />
      <Text t="p6">{networkDisplayName}</Text>
    </Network>
  );
}

function AccountSection({ address = null } = {}) {
  if (address !== null)
    return (
      <Header>
        <Flex height="50px" alignItems="center">
          <Jazzicon address={address} />
          <StyledAddress t="p5">{cutMiddle(address, 7, 5)}</StyledAddress>
        </Flex>
      </Header>
    );

  return (
    <Header>
      <Flex height="50px" alignItems="center">
        <AccountConnect />
      </Flex>
    </Header>
  );
}

function Sidebar({ feeds, system, address, network }) {
  return (
    <Fragment>
      <AccountSection address={address} />
      <NetworkSection networkID={network.id} swappable={network.swappable} />
      <Section>
        <SidebarFeeds feeds={feeds} />
      </Section>
      <Section>
        <SidebarSystem system={system} />
      </Section>
    </Fragment>
  );
}

function mapStateToProps(state) {
  return {
    feeds: getAllFeeds(state),
    system: state.network.system
  };
}

export default connect(mapStateToProps)(Sidebar);
