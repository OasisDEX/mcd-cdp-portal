import React from 'react';
import { NOW_GITHUB_REPO } from '../static/version.json';

const SiteVersion = () => {
  console.log(NOW_GITHUB_REPO);
  return process.env.NODE_ENV === 'production' ? (
    <div>production</div>
  ) : (
    <div>local</div>
  );
};

export default SiteVersion;
