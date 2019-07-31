import React, { useEffect } from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';

import { Flex, Box, Grid } from '@makerdao/ui-components-core';
import { useSpring, animated } from 'react-spring';
import { useCurrentRoute } from 'react-navi';
import { Routes } from '../utils/constants';

import useMaker from 'hooks/useMaker';
import useSidebar from 'hooks/useSidebar';
import GlobalSidebar from 'components/Sidebars/Global';
import SidebarActionLayout from 'layouts/SidebarActionLayout';
import TransactionManager from 'components/TransactionManager';
import NotificationManager from 'components/NotificationManager';
import AccountBox from 'components/AccountBox';
import { getMeasurement } from 'styles/theme';
const springConfig = { mass: 1, tension: 500, friction: 50 };

const SHOW_MIGRATE_BUTTON = false;

const animations = {
  fade: [{ opacity: 0.9 }, { opacity: 1 }],
  fadeAway: [
    {
      transform: 'scale(0.9)',
      opacity: 0
    },
    {
      transform: 'scale(1)',
      opacity: 1
    }
  ],
  slide: [
    { transform: 'translate3d(0px, 0, 0)' },
    {
      transform: `translate3d(-${getMeasurement('sidebarWidth')}px, 0, 0)`
    }
  ]
};

const AnimatedWrap = styled(animated.div)`
  width: 100%;
`;

function Sidebar() {
  const { account, resetTx, selectors, network } = useMaker();
  const { current } = useSidebar();
  const { component: SidebarComponent, props } = current;
  const [slideStart, slideEnd] = animations.slide;
  const [p2off, p2on] = animations.fade;
  const [p1off, p1on] = animations.fadeAway;
  const { url } = useCurrentRoute();
  const onBorrowLandingPage = url.pathname === `/${Routes.BORROW}`;

  const [slideAnimation, setSlideAnimation] = useSpring(() => ({
    to: slideStart,
    config: springConfig
  }));

  const [p1Animation, setP1Animation] = useSpring(() => ({
    to: p1on,
    config: springConfig
  }));

  const [p2Animation, setP2Animation] = useSpring(() => ({
    to: p2off,
    config: springConfig
  }));

  const resetSidebarActionAnimated = () => {
    const { reset } = props;

    setP1Animation({
      to: p1on
    });

    setP2Animation({
      to: p2off
    });

    setSlideAnimation({
      to: slideStart,
      onRest() {
        reset();
      }
    });
  };

  useEffect(() => {
    if (SidebarComponent) {
      setP1Animation({
        to: p1off
      });

      setP2Animation({
        to: p2on
      });

      setSlideAnimation({
        to: slideEnd,
        onRest() {}
      });
    }
  }, [
    SidebarComponent,
    p1off,
    p2on,
    setP1Animation,
    setP2Animation,
    setSlideAnimation,
    slideEnd
  ]);

  return (
    <Box minWidth={getMeasurement('sidebarWidth')} pt="s">
      {SHOW_MIGRATE_BUTTON && <NotificationManager mb="s" />}
      <TransactionManager
        transactions={selectors.transactions()}
        network={network}
        resetTx={resetTx}
      />
      <Grid gridRowGap="s" mt="s">
        {onBorrowLandingPage ? null : <AccountBox currentAccount={account} />}
        <Flex css={'overflow:hidden;'}>
          <AnimatedWrap style={{ ...p1Animation, zIndex: 1 }} key="panel1">
            <GlobalSidebar />
          </AnimatedWrap>

          <AnimatedWrap
            style={{ ...slideAnimation, ...p2Animation, zIndex: 2 }}
            key="panel2"
          >
            {!!SidebarComponent && (
              <SidebarActionLayout onClose={resetSidebarActionAnimated}>
                <SidebarComponent
                  {...props}
                  reset={resetSidebarActionAnimated}
                />
              </SidebarActionLayout>
            )}
          </AnimatedWrap>
        </Flex>
      </Grid>
    </Box>
  );
}

export default hot(Sidebar);
