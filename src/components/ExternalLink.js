import React from 'react';
import { Address, Link, Flex, Box } from '@makerdao/ui-components-core';
import { etherscanLink } from '../utils/ethereum';
import { ReactComponent as ExternalLinkIcon } from 'images/external-link.svg';
import { getColor } from 'styles/theme';

const ExternalLink = ({
  children,
  string,
  network,
  hideText,
  fill = '#447afb'
}) => (
  <Link
    fontWeight="400"
    href={etherscanLink(string, network)}
    target="_blank"
    css={`
      whitespace: nowrap;
      &:hover svg {
        fill: ${getColor('slate.600')};
      }
    `}
  >
    {children}
    <Flex alignItems="center">
      {!hideText && (
        <Box mr="2xs">
          <Address full={string} shorten={true} expandable={false} />
        </Box>
      )}
      <ExternalLinkIcon fill={fill} />
    </Flex>
  </Link>
);

export default ExternalLink;
