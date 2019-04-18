import React, { useEffect, useState } from 'react';

import { Flex, Box, Card, Text } from '@makerdao/ui-components-core';
import { useSpring, animated } from 'react-spring';

import ExternalLink from 'components/ExternalLink';
import { ReactComponent as CloseIcon } from 'images/close-simple.svg';
import { getMeasurement, getColor, getSpace } from 'styles/theme';
const springConfig = { mass: 1, tension: 500, friction: 50 };

const PLACEHOLDER_HEIGHT = 72;
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

const txAnimations = {
  fade: [
    {
      opacity: 0,
      marginTop: `-${PLACEHOLDER_HEIGHT + parseInt(getSpace('s'))}px`
    },
    { opacity: 1, marginTop: `0px` }
  ],
  slide: [
    { transform: `translate3d(-${getMeasurement('sidebarWidth')}px, 0, 0)` },
    { transform: `translate3d(-0px, 0, 0)` }
  ]
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
  const [animStart, animEnd] = txAnimations.fade;

  const [txAnimation, setTxAnimation] = useSpring(() => ({
    to: animStart,
    config: springConfig
  }));
  const txCount = transactions.length;
  const multipleTx = txCount > 1;

  useEffect(() => {
    setTxAnimation({
      to: txCount ? animEnd : animStart
    });
  }, [txCount]);

  const resolvedState = resolveTxManagerState(
    transactions.map(({ tx }) => tx.state())
  );
  const bg = txManagerBgPalette[resolvedState];
  const textColor = txManagerTextPalette[resolvedState];
  return (
    <animated.div
      style={{
        ...txAnimation,
        height: txCount ? '' : `${PLACEHOLDER_HEIGHT}px`
      }}
    >
      <Card mr="s" p="s" mt="s">
        <Flex>
          <Flex alignItems="flex-start">
            <Circle color={bg} size={'24px'} mr="xs" mt="-1px" />

            <Box>
              <Flex alignItems="center">
                <Text color={textColor} t="h5">
                  {txCount} Transaction{txCount > 1 && 's'}
                </Text>
              </Flex>
              {multipleTx && (
                <TinyButton mt="xs" onClick={() => setExpanded(!expanded)}>
                  <Text color={textColor} t="p6">
                    {expanded ? 'Hide' : 'Show'} transaction{txCount > 1 && 's'}
                  </Text>
                </TinyButton>
              )}
              {multipleTx && !expanded ? null : (
                <Box>
                  {transactions.map(({ id, tx, message }) => {
                    const { hash } = tx;
                    const resolvedState = resolveTxManagerState([tx.state()]);
                    const bg = txManagerBgPalette[resolvedState];
                    const textColor = txManagerTextPalette[resolvedState];

                    return (
                      <Box key={`tx_${id}`}>
                        <Flex mt={multipleTx ? 's' : ''} alignItems="center">
                          {multipleTx && (
                            <Circle color={bg} size={'14px'} mr="xs" />
                          )}
                          <Text t="body" color={textColor}>
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
    </animated.div>
  );
};

export default TransactionManager;
