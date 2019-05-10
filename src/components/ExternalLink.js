import React from 'react';
import { Address, Link } from '@makerdao/ui-components-core';
import { etherscanLink } from '../utils/ethereum';
import { ReactComponent as ExternalLinkIcon } from 'images/external-link.svg';

const ExternalLink = ({
  children,
  address,
  network,
  hideText,
  fill = '#447afb'
}) => (
  <Link
    fontWeight="400"
    href={etherscanLink(address, network)}
    target="_blank"
    css={{ whiteSpace: 'nowrap' }}
  >
    {children}
    {!hideText && <Address full={address} shorten={true} expandable={false} />}
    <ExternalLinkIcon fill={fill} />
  </Link>
);

export default ExternalLink;
