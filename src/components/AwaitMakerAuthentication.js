import React from 'react';
import useMaker from 'hooks/useMaker';

import LoadingLayout from 'layouts/LoadingLayout';

function AwaitMakerAuthentication({ children }) {
  const { authenticated } = useMaker();
  if (authenticated) return children;
  return <LoadingLayout text="Loading..." />;
}

export default AwaitMakerAuthentication;
