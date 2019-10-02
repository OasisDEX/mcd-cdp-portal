import React, { useState, useEffect } from 'react';
import { Grid, Box, Link, Text } from '@makerdao/ui-components-core';
import 'whatwg-fetch';
import styled from 'styled-components';

const VersionText = styled(Text)`
  font-size: 0.75em;
  color: lightgray;
`;
const VersionLink = styled(Link)`
  &:hover {
    ${VersionText} {
      color: gray;
    }
    ${Grid} {
      border: 1px solid gray;
      border-radius: 3px;
    }
  }
`;

const SiteVersion = () => {
  const [commitMsg, setCommitMsg] = useState('');
  const [commitDate, setCommitDate] = useState('');
  const { COMMIT_SHA, COMMIT_BRANCH } = require('../static/version.json');

  const apiUrl = `https://api.github.com/repos/makerdao/mcd-cdp-portal/git/commits/${COMMIT_SHA}`;

  useEffect(() => {
    const fetchCommitMsg = async () => {
      if (!COMMIT_SHA) return null;
      const rawJson = await fetch(apiUrl);
      const commitObj = await rawJson.json();
      const {
        message,
        committer: { date }
      } = commitObj;
      const d = new Date(date);
      setCommitDate(d.toLocaleString());
      setCommitMsg(message);
    };
    fetchCommitMsg();
  }, [apiUrl, COMMIT_SHA]);

  if (!COMMIT_SHA) return null;

  const commitUrl = `https://github.com/makerdao/mcd-cdp-portal/commit/${COMMIT_SHA}`;
  return (
    <Box>
      {commitMsg !== '' ? (
        <VersionLink href={commitUrl} target="_blank">
          <Grid p="s" gridTemplateColumns="1fr 2fr">
            <VersionText>Commit:</VersionText>
            <VersionText>{commitMsg}</VersionText>

            <VersionText>Hash:</VersionText>
            <VersionText>{COMMIT_SHA.substring(0, 8)}</VersionText>

            <VersionText>Branch:</VersionText>
            <VersionText>{COMMIT_BRANCH}</VersionText>

            <VersionText>Uploaded:</VersionText>
            <VersionText>{commitDate}</VersionText>
          </Grid>
        </VersionLink>
      ) : null}
    </Box>
  );
};

export default SiteVersion;
