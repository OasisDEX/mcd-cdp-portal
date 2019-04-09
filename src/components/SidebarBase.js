import React, { useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import { getAllFeeds } from 'reducers/network/cdpTypes';

import { Flex, Box, Grid, Card } from '@makerdao/ui-components-core';
import { useSpring, animated } from 'react-spring';

import AccountConnect from './SidebarAccountConnect';
import WalletSelection from 'components/WalletSelection';
import useMaker from 'hooks/useMaker';
import useSidebar from 'hooks/useSidebar';
import sidebars from 'components/Sidebars';
import { getMeasurement } from 'styles/theme';
const { global: GlobalSidebar } = sidebars;

function AccountSection({ currentAccount }) {
  return (
    <Card p="s">
      {currentAccount ? (
        <WalletSelection currentAccount={currentAccount} />
      ) : (
        <Flex alignItems="center">
          <AccountConnect />
        </Flex>
      )}
    </Card>
  );
}

const animations = {
  fade: [{ opacity: 0 }, { opacity: 1 }],
  slide: [
    { transform: 'translate3d(0px, 0, 0)' },
    { transform: `translate3d(-${getMeasurement('sidebarWidth')}px, 0, 0)` }
  ]
};

const AnimatedWrap = styled(animated.div)`
  width: 100%;
  padding-right: ${({ theme }) => theme.space.s};
`;

function Sidebar() {
  const { account } = useMaker();
  const { current } = useSidebar();
  const { component: SidebarComponent, props } = current;
  const [slideStart, slideEnd] = animations.slide;
  const [slideAnimation, setAnimation] = useSpring(() => ({
    to: slideStart,
    config: { mass: 1, tension: 210, friction: 25 }
  }));

  const resetSidebarActionAnimated = () => {
    const { reset } = props;

    setAnimation({
      to: slideStart,
      onRest() {
        reset();
      }
    });
  };

  useEffect(() => {
    if (SidebarComponent) {
      setAnimation({
        to: slideEnd,
        onRest() {}
      });
    }
  }, [SidebarComponent]);

  // if we want to change the sidebar color when connected vs. read-only mode.
  return (
    <Box>
      <Grid gridRowGap="s" py="s">
        <Box pr="s">
          <AccountSection currentAccount={account} />
        </Box>
        <Flex css={'overflow:hidden;'}>
          <AnimatedWrap style={slideAnimation} key="panel1">
            <GlobalSidebar />
          </AnimatedWrap>

          <AnimatedWrap style={slideAnimation} key="panel2">
            {!!SidebarComponent && (
              <SidebarComponent {...props} reset={resetSidebarActionAnimated} />
            )}
          </AnimatedWrap>
        </Flex>
      </Grid>
    </Box>
  );
}

function mapStateToProps(state) {
  return {
    feeds: getAllFeeds(state),
    system: state.network.system
  };
}

export default hot(connect(mapStateToProps)(Sidebar));
