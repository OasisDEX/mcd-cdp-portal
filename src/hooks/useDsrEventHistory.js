import { useEffect, useState } from 'react';
import useMaker from 'hooks/useMaker';
import { FeatureFlags } from '../utils/constants';
import debug from 'debug';
const log = debug('maker:useDsrEventHistory');

export default function useDsrEventHistory(address) {
  const { maker, txLastUpdate } = useMaker();
  const [events, setEvents] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!FeatureFlags.FF_VAULTHISTORY) return null;

  let isCancelled = false;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!maker || !address) return;
    async function getHistory() {
      setEvents(null);
      setIsLoading(true);
      log(`Getting DSR event history for address ${address}...`);
      if (isCancelled) return;
      const events = await maker
        .service('mcd:savings')
        .getEventHistory(address);
      if (isCancelled) {
        setIsLoading(false);
        return;
      }
      log('Got DSR events for address' + address, events);
      setEvents(events);
      setIsLoading(false);
    }
    getHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => (isCancelled = true || setIsLoading(false));
  }, [maker, address, txLastUpdate]);

  return { events, isLoading };
}
