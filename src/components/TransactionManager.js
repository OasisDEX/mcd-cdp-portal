import React, { useState, useRef, useLayoutEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Flex, Box, Card, Text } from '@makerdao/ui-components-core';
import { Button } from '@makerdao/ui-components-core';
import { ReactComponent as ExternalLinkIcon } from 'images/external-link.svg';
import sumBy from 'lodash/sumBy';
import useModal from 'hooks/useModal';
import { txManager } from 'references/config';
import { etherscanLink } from '../utils/ethereum';
import useLanguage from '../hooks/useLanguage';

import { ReactComponent as TxIconInitialized } from 'images/tx-initialized.svg';
import { ReactComponent as TxIconPending } from 'images/tx-pending.svg';
import { ReactComponent as TxIconSuccess } from 'images/tx-success.svg';
import { ReactComponent as TxIconError } from 'images/tx-error.svg';
import { ReactComponent as ExpandIcon } from 'images/tx-expand.svg';
import { ReactComponent as CollapseIcon } from 'images/tx-collapse.svg';

const { autoDismissTime, autoDismissFadeoutTime } = txManager;

const REF_ELEMENT_PADDING = 23;

const ActionButton = ({ children, ...rest }) => (
  <Button
    display="inline-block"
    variant="secondary-outline"
    px="0"
    py="0"
    minWidth="4.5rem"
    lineHeight="initial"
    height="23px"
    bg="#fff !important"
    {...rest}
  >
    <Text
      display="inline-block"
      px="4px"
      py="0px"
      t="smallCaps"
      lineHeight="20px"
      fontWeight="600"
    >
      {children}
    </Text>
  </Button>
);

const spinKeyframes = keyframes`
  0% {
    transform: rotate(0deg);
  };
  100% {
    transform: rotate(360deg);
  };
`;

const spinAnimation = css`
  ${spinKeyframes} 1s infinite linear;
`;

const TxIcon = ({ state, ...props }) => (
  <Box
    width="31px"
    lineHeight="25px"
    css="text-align: left; margin-top: 3px;"
    {...props}
  >
    {state === 'pending' ? (
      <StyledTxIcon width="20px" height="20px">
        {txIcons[state]}
      </StyledTxIcon>
    ) : (
      txIcons[state]
    )}
  </Box>
);

const MessageText = styled(Text)`
  flex-shrink: 1;
  max-height: 4.5rem;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  padding-right: 5px;
`;

const StyledTxIcon = styled(Box).attrs(() => ({}))`
  position: relative;
  animation: ${spinAnimation};
`;

const txIcons = {
  initialized: <TxIconInitialized />,
  pending: <TxIconPending />,
  success: <TxIconSuccess />,
  error: <TxIconError />
};

const Circle = ({ size, color, ...props }) => (
  <Box
    width={size}
    height={size}
    bg={color}
    borderRadius="50%"
    border="1px solid #D4D9E1"
    css="line-height: 23px; text-align: center"
    {...props}
  >
    {props.children}
  </Box>
);

const TinyButton = props => (
  <Box
    bg="rgba(0, 0, 0, 0.03)"
    p="xs"
    py="4px"
    borderRadius="3px"
    display="inline-block"
    css={{
      cursor: 'pointer'
    }}
    {...props}
  />
);

const TransactionManager = ({
  transactions,
  hideTransaction,
  drawExpanded,
  setDrawExpanded,
  network
}) => {
  const { lang } = useLanguage();
  const { showing: modalShowing } = useModal();
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    setHeight(ref.current.clientHeight);
  });

  const visibleCount = sumBy(transactions, ({ visible }) => visible && 1) || 0;
  let rowCount = 0;

  return (
    <>
      <Box
        zIndex="9999"
        css={`
          overflow: hidden;
          transition: margin-top 500ms ease;
          margin-top: ${modalShowing ? '50px' : '0'};
        `}
      >
        <Box
          css={`
            overflow: hidden;
            transition: opacity 1s ease, max-height 1s ease;
            max-height: ${visibleCount === 0
              ? '0'
              : `${height + REF_ELEMENT_PADDING}px`};
            opacity: ${visibleCount === 0 ? '0' : '1'};
          `}
        >
          <Card
            ref={ref}
            pt="11px"
            css={`
              overflow: hidden;
              margin-bottom: 12px;
            `}
          >
            <Flex
              justifyContent="space-between"
              alignContent="center"
              px="s"
              pb="s2"
            >
              <Text t="body" fontWeight="medium">
                <Circle color="white" size={'25px'} mr="xs" css="float: left;">
                  <Text color="steel" t="body" fontWeight="medium">
                    {visibleCount}
                  </Text>
                </Circle>
                {visibleCount > 1
                  ? lang.transaction_manager.transaction_plural_capitalised
                  : lang.transaction_manager.transaction_singular_capitalised}
              </Text>
              {visibleCount > 0 && (
                <TinyButton
                  bg="transparent"
                  mt="xs"
                  onClick={() => setDrawExpanded(e => !e)}
                  css="margin-top: 0; padding: 0;"
                >
                  {drawExpanded ? <CollapseIcon /> : <ExpandIcon />}
                </TinyButton>
              )}
            </Flex>
            <Box
              css={`
                overflow: hidden;
                ${drawExpanded ? '' : 'height: 0'}
              `}
            >
              {transactions.map(
                ({
                  id,
                  visible,
                  hash,
                  state,
                  success,
                  failed,
                  message,
                  pendingRemoval
                }) =>
                  true && (
                    <Box
                      key={id}
                      bg={
                        visible
                          ? rowCount++ % 2 === 0
                            ? 'coolGrey.100'
                            : 'white'
                          : ''
                      }
                      css={`
                        transition: max-height 0.5s linear;
                        height: auto;
                        ${visible ? 'max-height: 105px;' : 'max-height: 0;'}
                      `}
                    >
                      <Box
                        bg={state === 'initialized' ? '#fff3d8' : 'transparent'}
                        css={`
                          opacity: ${pendingRemoval ? '0' : '1'};
                          transition: opacity ${autoDismissFadeoutTime}ms linear
                              ${autoDismissTime}ms,
                            background-color 1500ms linear;
                        `}
                      >
                        <Flex
                          justifyContent="flex-start"
                          f
                          alignContent="center"
                          px="s"
                          pb="s2"
                          css="padding-top: 8px; padding-bottom: 6px; line-height: 23px;"
                        >
                          <>
                            {state === 'initialized' ? (
                              <>
                                <TxIcon state={state} />
                                <Box>
                                  <Text t="body" fontWeight="medium">
                                    Transaction waiting to be signed
                                    <br />
                                  </Text>
                                  <Text t="body">{message}</Text>
                                </Box>
                              </>
                            ) : failed ? (
                              <>
                                <TxIcon state={state} />
                                <Box style={{ flexShrink: 1 }}>
                                  <MessageText t="body">
                                    {message}
                                    <br />
                                  </MessageText>
                                  <ActionButton
                                    onClick={() => {}}
                                    as="a"
                                    target="_blank"
                                    rel="noopener"
                                    href={etherscanLink(hash, network)}
                                    m="6px 8px 2px 0"
                                  >
                                    {lang.view}&nbsp;
                                    <ExternalLinkIcon fill="#708390" />
                                  </ActionButton>
                                  <ActionButton
                                    disabled={false}
                                    onClick={() => hideTransaction(id)}
                                    m="6px 8px 2px 0"
                                  >
                                    {lang.dismiss}
                                  </ActionButton>
                                </Box>
                              </>
                            ) : (
                              <>
                                <TxIcon state={state} />
                                <MessageText t="body">{message}</MessageText>
                              </>
                            )}
                          </>

                          <Flex justifyContent="flex-end" flexGrow="1">
                            {hash && !failed ? (
                              <ActionButton
                                onClick={() => {}}
                                as="a"
                                target="_blank"
                                rel="noopener"
                                href={etherscanLink(hash, network)}
                                m="2px 0 2px 0"
                              >
                                {lang.view}&nbsp;
                                <ExternalLinkIcon fill="#708390" />
                              </ActionButton>
                            ) : null}
                          </Flex>
                        </Flex>

                        {/* Pending removal timer progress indicator */}
                        <Box css="width: 100%; background: #efefef;">
                          <Box
                            css={`
                              background: #${success ? '45bbae' : 'e67002'};
                              transition: width ${autoDismissTime}ms linear 0s;
                              width: ${pendingRemoval ? '100%' : '0%'};
                              height: ${pendingRemoval ? '1px' : '0'};
                            `}
                          />
                        </Box>
                      </Box>
                    </Box>
                  )
              )}
            </Box>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default TransactionManager;
