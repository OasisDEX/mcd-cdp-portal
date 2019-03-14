import { useContext, useEffect, useState } from 'react';

import { MakerObjectContext } from 'providers/MakerHooksProvider';

function useMaker() {
  const maker = useContext(MakerObjectContext);
  const [authenticated, setAuthenticated] = useState(false);

  async function authenticatedMaker() {
    await maker.authenticate();
    return maker;
  }

  useEffect(() => {
    maker.authenticate().then(() => {
      setAuthenticated(true);
    });

    return () => {
      setAuthenticated(false);
    };
  }, [maker]);

  return { maker, authenticated, authenticatedMaker };
}

export default useMaker;
