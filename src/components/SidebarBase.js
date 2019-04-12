import React, { useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import { getAllFeeds } from 'reducers/network/cdpTypes';

import { Flex, Box, Grid, Card, Text } from '@makerdao/ui-components-core';
import { useSpring, animated } from 'react-spring';

import AccountConnect from './SidebarAccountConnect';
import WalletSelection from 'components/WalletSelection';
import useMaker from 'hooks/useMaker';
import useSidebar from 'hooks/useSidebar';
import sidebars from 'components/Sidebars';
import ExternalLink from 'components/ExternalLink';
import { getMeasurement } from 'styles/theme';
const { global: GlobalSidebar } = sidebars;

const txAnimation = {
  fade: [{ opacity: 0 }, { opacity: 1 }],
  slide: [{ top: `-100%` }, { top: 0 }]
};

// todo - far from final
const TransactionManager = ({ transactions = [], removeTx, network } = {}) => {
  const [slideStart, slideEnd] = txAnimation.slide;

  const [slideAnimation] = useSpring(() => ({
    from: slideStart,
    to: slideEnd,
    config: springConfig
  }));

  if (!transactions.length) return null;

  return (
    <Box bg="red" mr="s" style={slideAnimation}>
      {transactions.map(tx => (
        <Card mt="s" key={tx.id}>
          <Flex m="s" flexDirection="column">
            <Text>{tx.message}</Text>
            <button onClick={() => removeTx(tx.id)}>close</button>
            {tx.hash ? (
              <ExternalLink address={tx.hash} network={network} />
            ) : null}
            <Text>{tx.state}</Text>
          </Flex>
        </Card>
      ))}
    </Box>
  );
};
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

const springConfig = { mass: 1, tension: 210, friction: 25 };

function Sidebar() {
  const {
    account,
    maker,
    transactions,
    newTxListener,
    resetTx,
    removeTx,
    network
  } = useMaker();
  const { current } = useSidebar();
  const { component: SidebarComponent, props } = current;
  const [slideStart, slideEnd] = animations.slide;
  const [faded, visible] = animations.fade;
  const [slideAnimation, setSlideAnimation] = useSpring(() => ({
    to: slideStart,
    config: springConfig
  }));

  const [p1FadeAnimation, setP1FadeAnimation] = useSpring(() => ({
    to: visible,
    config: springConfig
  }));

  const [p2FadeAnimation, setP2FadeAnimation] = useSpring(() => ({
    to: faded,
    config: springConfig
  }));

  const resetSidebarActionAnimated = () => {
    const { reset } = props;

    setP1FadeAnimation({
      to: visible
    });

    setP2FadeAnimation({
      to: faded
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
      setP1FadeAnimation({
        to: faded
      });

      setP2FadeAnimation({
        to: visible
      });

      setSlideAnimation({
        to: slideEnd,
        onRest() {}
      });
    }
  }, [
    SidebarComponent,
    faded,
    setP1FadeAnimation,
    setP2FadeAnimation,
    setSlideAnimation,
    slideEnd,
    visible
  ]);

  useEffect(() => {
    const ethToSend = '0.01';
    const recipient = '0xfc5Fff3E913add2DC6C7b1Dd0B7946660Ed8ebEc';

    window.pretendFakeTx = () => {
      newTxListener(maker.getToken('ETH').transfer(recipient, ethToSend))(
        `Sending ${ethToSend} ETH`
      );
    };

    window.pretendResetTx = () => {
      resetTx();
    };
  }, []);

  return (
    <Box>
      <TransactionManager
        transactions={transactions}
        network={network}
        removeTx={removeTx}
      />
      <Grid gridRowGap="s" py="s">
        <Box pr="s">
          <AccountSection currentAccount={account} />
        </Box>
        <Flex css={'overflow:hidden;'}>
          <AnimatedWrap
            style={{ ...slideAnimation, ...p1FadeAnimation }}
            key="panel1"
          >
            <GlobalSidebar />
          </AnimatedWrap>

          <AnimatedWrap
            style={{ ...slideAnimation, ...p2FadeAnimation }}
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

function mapStateToProps(state) {
  return {
    feeds: getAllFeeds(state),
    system: state.network.system
  };
}

export default hot(connect(mapStateToProps)(Sidebar));
