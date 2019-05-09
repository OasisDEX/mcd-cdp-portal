import React, { useEffect } from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';

import { Flex, Box, Grid, Card } from '@makerdao/ui-components-core';
import { useSpring, animated } from 'react-spring';

import AccountConnect from './SidebarAccountConnect';
import WalletSelection from 'components/WalletSelection';
import useMaker from 'hooks/useMaker';
import useSidebar from 'hooks/useSidebar';
import sidebars from 'components/Sidebars';
import TransactionManager from 'components/TransactionManager';
import NotificationManager from 'components/NotificationManager';
import theme, { getMeasurement } from 'styles/theme';
const { global: GlobalSidebar } = sidebars;
const springConfig = { mass: 1, tension: 500, friction: 50 };

const SHOW_MIGRATE_BUTTON = true;

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
      transform: `translate3d(-${getMeasurement('sidebarWidth') -
        theme.space.s}px, 0, 0)`
    }
  ]
};

const AnimatedWrap = styled(animated.div)`
  width: 100%;
`;

function Sidebar() {
  const {
    account,
    maker,
    newTxListener,
    resetTx,
    selectors,
    network
  } = useMaker();
  const { current } = useSidebar();
  const { component: SidebarComponent, props } = current;
  const [slideStart, slideEnd] = animations.slide;
  const [p2off, p2on] = animations.fade;
  const [p1off, p1on] = animations.fadeAway;

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

    setP1Animation,
    setP2Animation,
    setSlideAnimation,
    slideEnd
  ]);

  useEffect(() => {
    window.pretendFakeTx = (
      ethToSend = '0.01',
      recipient = '0xBc5d63fFc63f28bE50EDc63D237151ef7A2d7E11'
    ) => {
      newTxListener(
        maker.getToken('ETH').transfer(recipient, ethToSend),
        `Sending ${ethToSend} ETH`
      );
    };
  }, []);

  return (
    <Box pr="s">
      {SHOW_MIGRATE_BUTTON && <NotificationManager />}
      <TransactionManager
        transactions={selectors.transactions()}
        network={network}
        resetTx={resetTx}
      />
      <Grid gridRowGap="s" py="s">
        <Box>
          <AccountSection currentAccount={account} />
        </Box>
        <Flex css={'overflow:hidden;'}>
          <AnimatedWrap style={{ ...p1Animation, zIndex: 1 }} key="panel1">
            <GlobalSidebar />
          </AnimatedWrap>

          <AnimatedWrap
            style={{ ...slideAnimation, ...p2Animation, zIndex: 2 }}
            key="panel2"
          >
            {!!SidebarComponent && (
              <SidebarComponent {...props} reset={resetSidebarActionAnimated} />
            )}
          </AnimatedWrap>
        </Flex>
      </Grid>
    </Box>
  );
}

export default hot(Sidebar);
