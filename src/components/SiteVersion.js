import React from 'react';

const GithubInfo = () => {
  const {
    NOW_GITHUB_REPO,
    NOW_GITHUB_ORG,
    NOW_GITHUB_COMMIT_SHA,
    NOW_GITHUB_COMMIT_REPO,
    NOW_GITHUB_COMMIT_AUTHOR_NAME
  } = require('../static/version.json');

  console.log(
    NOW_GITHUB_REPO,
    NOW_GITHUB_ORG,
    NOW_GITHUB_COMMIT_SHA,
    NOW_GITHUB_COMMIT_REPO,
    NOW_GITHUB_COMMIT_AUTHOR_NAME
  );
  return <div>production</div>;
};

const SiteVersion = () => {
  return process.env.NODE_ENV === 'production' ? (
    <GithubInfo />
  ) : (
    <div>local</div>
  );
};

export default SiteVersion;
