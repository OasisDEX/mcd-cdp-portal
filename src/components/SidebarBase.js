import React, { useEffect, useState } from 'react';
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
import { ReactComponent as CloseIcon } from 'images/close-simple.svg';
import { getMeasurement, getColor } from 'styles/theme';
const { global: GlobalSidebar } = sidebars;

const resolveTxManagerState = states => {
  // if any pending, force yellow.
  if (states.includes('pending')) return 'pending';

  // if no pending but any error, show red.
  if (states.includes('error')) return 'error';

  // no pending, mined/finished but still visible, show green.
  return 'success';
};
const txManagerBgPalette = {
  pending: getColor('yellowPastel'),
  error: getColor('redPastel'),
  success: getColor('greenDark')
};

const txManagerTextPalette = {
  pending: getColor('yellowDark'),
  error: getColor('redDark'),
  success: getColor('greenDark')
};

const txAnimation = {
  fade: [{ opacity: 0 }, { opacity: 1 }],
  slide: [{ top: `-100%` }, { top: 0 }]
};

const Circle = ({ size, color, ...props }) => (
  <Box width={size} height={size} bg={color} borderRadius="50%" {...props} />
);
const TinyButton = props => (
  <Box
    bg="rgba(0, 0, 0, 0.03)"
    p="xs"
    py="4px"
    borderRadius="3px"
    display="inline-block"
    {...props}
  />
);

const TransactionManager = ({ transactions = [], network, resetTx } = {}) => {
  const [expanded, setExpanded] = useState(false);
  const [slideStart, slideEnd] = txAnimation.slide;

  const [slideAnimation] = useSpring(() => ({
    from: slideStart,
    to: slideEnd,
    config: springConfig
  }));
  const txCount = transactions.length;

  if (!txCount) return null;

  const resolvedState = resolveTxManagerState(
    transactions.map(({ tx }) => tx.state())
  );
  const bg = txManagerBgPalette[resolvedState];
  const textColor = txManagerTextPalette[resolvedState];
  return (
    <Card mr="s" p="s" mt="s" borderRadius="20px" style={slideAnimation}>
      <Flex>
        <Flex alignItems="flex-start">
          <Circle color={bg} size={'24px'} mr="xs" mt="-1px" />

          <Box>
            <Flex alignItems="center">
              <Text color={textColor} t="textM" fontWeight="medium">
                {txCount} Transaction{txCount > 1 && 's'}
              </Text>
            </Flex>
            <TinyButton mt="xs" onClick={() => setExpanded(!expanded)}>
              <Text color={textColor} t="p6">
                {expanded ? 'Hide' : 'Show'} transaction{txCount > 1 && 's'}
              </Text>
            </TinyButton>
            {!expanded ? null : (
              <Box>
                {transactions.map(({ id, tx, message }) => {
                  const { hash } = tx;
                  const resolvedState = resolveTxManagerState([tx.state()]);
                  const bg = txManagerBgPalette[resolvedState];
                  const textColor = txManagerTextPalette[resolvedState];

                  return (
                    <Box key={`tx_${id}`}>
                      <Flex mt="s" alignItems="center">
                        <Circle color={bg} size={'14px'} mr="xs" />
                        <Text t="textS" color={textColor}>
                          {message}
                        </Text>

                        {hash ? (
                          <TinyButton ml="xs">
                            <ExternalLink
                              address={hash}
                              network={network}
                              hideText
                              fill={textColor}
                            >
                              <Text color={textColor} t="p6" mr="3px">
                                View
                              </Text>
                            </ExternalLink>
                          </TinyButton>
                        ) : null}
                        {/* <Text>{tx.state()}</Text> */}
                      </Flex>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        </Flex>
        <Box ml="auto" onClick={resetTx}>
          <CloseIcon width="10" fill={textColor} />
        </Box>
      </Flex>
    </Card>
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
    newTxListener,
    resetTx,
    selectors,
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
    <Box>
      <TransactionManager
        transactions={selectors.transactions()}
        network={network}
        resetTx={resetTx}
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
