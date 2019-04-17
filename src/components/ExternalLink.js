import React from 'react';
import { Address, Link } from '@makerdao/ui-components-core';
import { etherscanLink } from '../utils/ethereum';
import { ReactComponent as ExternalLinkIcon } from 'images/external-link.svg';

const ExternalLink = ({ address, network }) => (
  <Link fontWeight="400" href={etherscanLink(address, network)} target="_blank">
    <Address full={address} shorten={true} expandable={false} />
    <ExternalLinkIcon />
  </Link>
);

export default ExternalLink;
