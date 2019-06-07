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
  const {
    NOW_GITHUB_REPO,
    NOW_GITHUB_ORG,
    NOW_GITHUB_COMMIT_SHA,
    NOW_GITHUB_COMMIT_AUTHOR_NAME,
    NOW_GITHUB_COMMIT_REF
  } = require('../static/version.json');

  const [commitMsg, setCommitMsg] = useState('');
  const [commitDate, setCommitDate] = useState('');
  const apiUrl = `https://api.github.com/repos/${NOW_GITHUB_ORG}/${NOW_GITHUB_REPO}/git/commits/${NOW_GITHUB_COMMIT_SHA}`;

  useEffect(() => {
    const fetchCommitMsg = async () => {
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
  }, [apiUrl]);

  const commitUrl = `https://github.com/${NOW_GITHUB_ORG}/${NOW_GITHUB_REPO}/commit/${NOW_GITHUB_COMMIT_SHA}`;
  return (
    <Box>
      {commitMsg !== '' ? (
        <VersionLink href={commitUrl} target="_blank">
          <Grid p="s" gridTemplateColumns="1fr 2fr">
            <VersionText>Author:</VersionText>
            <VersionText>{NOW_GITHUB_COMMIT_AUTHOR_NAME}</VersionText>

            <VersionText>Commit:</VersionText>
            <VersionText>{commitMsg}</VersionText>

            <VersionText>Hash:</VersionText>
            <VersionText>{NOW_GITHUB_COMMIT_SHA.substring(0, 10)}</VersionText>

            <VersionText>Branch:</VersionText>
            <VersionText>{NOW_GITHUB_COMMIT_REF}</VersionText>

            <VersionText>Uploaded:</VersionText>
            <VersionText>{commitDate}</VersionText>
          </Grid>
        </VersionLink>
      ) : null}
    </Box>
  );
};

export default SiteVersion;
