import { useEffect, useState } from 'react';
import useMaker from 'hooks/useMaker';
import debug from 'debug';
const log = debug('maker:useDsrEventHistory');

export default function useDsrEventHistory(address) {
  const { maker, txLastUpdate } = useMaker();
  const [events, setEvents] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  let isCancelled = false;
  useEffect(() => {
    if (!maker || !address) return;
    async function getHistory() {
      setEvents(null);
      setIsLoading(true);
      log(`Getting DSR event history for address ${address}...`);
      const events = await maker
        .service('mcd:savings')
        .getEventHistory(address);
      if (isCancelled) return;
      log('Got DSR events for address ' + address, events);
      setEvents(events);
      setIsLoading(false);
    }
    getHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => (isCancelled = true);
  }, [maker, address, txLastUpdate?.save]);

  return { events, isLoading };
}
