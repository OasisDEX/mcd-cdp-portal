import React, { Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import { getAllFeeds } from 'reducers/network/system';

import { Flex, Text } from '@makerdao/ui-components-core';
import { getColor } from 'styles/theme';
import SidebarWallet from './SidebarWallet';
import SidebarFeeds from './SidebarFeeds';
import SidebarSystem from './SidebarSystem';
import AccountConnect from './SidebarAccountConnect';
import config from 'references/config';
import WalletSelection from 'components/WalletSelection';
const { networkDisplayNames } = config;

const Section = styled.section`
  padding: 0 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight3};
  box-sizing: content-box;
`;
const VerticallyPaddedSection = styled(Section)`
  box-sizing: border-box;
  height: auto;
  padding-top: ${({ theme }) => theme.space.s};
  padding-bottom: ${({ theme }) => theme.space.s};
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

function AccountSection({ address = null, currentAccount } = {}) {
  return (
    <VerticallyPaddedSection>
      {address ? (
        <WalletSelection address={address} currentAccount={currentAccount} />
      ) : (
        <Flex alignItems="center">
          <AccountConnect />
        </Flex>
      )}
    </VerticallyPaddedSection>
  );
}

function Sidebar({ feeds, system, address, network, currentAccount }) {
  return (
    <Fragment>
      <AccountSection address={address} currentAccount={currentAccount} />
      <NetworkSection networkID={network.id} swappable={network.swappable} />
      {address && (
        <Section>
          <SidebarWallet />
        </Section>
      )}
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

export default hot(connect(mapStateToProps)(Sidebar));
