import React from 'react';
import { Link } from '@makerdao/ui-components-core';

const GithubInfo = () => {
  const {
    NOW_GITHUB_REPO,
    NOW_GITHUB_ORG,
    NOW_GITHUB_COMMIT_SHA,
    NOW_GITHUB_COMMIT_AUTHOR_NAME
  } = require('../static/version.json');

  console.log(
    NOW_GITHUB_REPO,
    NOW_GITHUB_ORG,
    NOW_GITHUB_COMMIT_SHA,
    NOW_GITHUB_COMMIT_AUTHOR_NAME
  );
  const commitUrl = `https://github.com/${NOW_GITHUB_ORG}/${NOW_GITHUB_REPO}/commit/${NOW_GITHUB_COMMIT_SHA}`;
  return <Link href={commitUrl}>production</Link>;
};

const SiteVersion = () => {
  return process.env.NODE_ENV === 'production' ? (
    <GithubInfo />
  ) : (
    <div>local</div>
  );
};

export default SiteVersion;
