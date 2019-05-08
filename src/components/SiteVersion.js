import React from 'react';
import { Link } from '@makerdao/ui-components-core';
import styled from 'styled-components';
import { message } from '../static/version.json';

const VersionLink = styled(Link)`
  font-size: 0.75em;
  color: lightgray;
  &:hover {
    color: gray;
  }
`;

const SiteVersion = () => {
  const commitId = message.substr(0, 7);

  return (
    <VersionLink
      href={`https://github.com/makerdao/mcd-cdp-portal/tree/${commitId}`}
      target="_blank"
    >
      {`Site version: ${message}`}
    </VersionLink>
  );
};

export default SiteVersion;
