import React from 'react';

const deployment = process.env.NOW_GITHUB_DEPLOYMENT;
const SiteVersion = () => {
  console.log(deployment);
  return <div>ugfiuy</div>;
};

export default SiteVersion;
