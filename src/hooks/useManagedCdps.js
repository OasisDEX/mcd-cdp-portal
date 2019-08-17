import { useState, useEffect } from 'react';
import useMaker from 'hooks/useMaker';

const useManagedCdps = address => {
  const { account, maker } = useMaker();
  const [managedCdps, setManagedCdps] = useState([]);

  // TODO: Hook into managed CDP state updates via SDK
  useEffect(() => {
    (async () => {
      if (!address && account) address = await maker.currentProxy();
      if (!address) return;
      console.debug('[useManagedCdps] Using address:', address);
      const cdps = await maker.service('mcd:cdpManager').getCdpIds(address);
      console.debug('[useManagedCdps] Got cdps:', cdps);
      const getCdps = await Promise.all(
        cdps.map(cdp => maker.service('mcd:cdpManager').getCdp(cdp.id, cdp.ilk))
      );
      console.debug('[useManagedCdps] Got managed CDPs:', getCdps);
      setManagedCdps(getCdps);
    })();
  }, [maker, account, address]);

  return managedCdps;
};

export default useManagedCdps;
