import { useContext, useEffect, useState } from 'react';

import { MakerObjectContext } from 'providers/MakerHooksProvider';

function toNullableCb(cb) {
  return () => {
    try {
      return cb();
    } catch (err) {
      return null;
    }
  };
}

function useMaker() {
  const maker = useContext(MakerObjectContext);
  const [authenticated, setAuthenticated] = useState(false);

  async function authenticatedMaker() {
    await maker.authenticate();
    return maker;
  }

  useEffect(() => {
    if (maker) {
      const currentAddressCb = maker.currentAddress;
      const currentAccountCb = maker.currentAccount;
      maker.currentAddress = toNullableCb(currentAddressCb);
      maker.currentAccount = toNullableCb(currentAccountCb);

      maker.authenticate().then(() => {
        setAuthenticated(true);
      });

      return () => {
        setAuthenticated(false);
      };
    }
  }, [maker]);

  return { maker, authenticated, authenticatedMaker };
}

export default useMaker;
