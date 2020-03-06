import { useEffect, useState } from 'react';
import useMaker from 'hooks/useMaker';
import debug from 'debug';
const log = debug('maker:useEventHistory');

export default function useEventHistory(id) {
  const { maker, txLastUpdate } = useMaker();
  const [events, setEvents] = useState(null);

  let isCancelled = false;
  useEffect(() => {
    if (!maker) return;
    async function getHistory() {
      setEvents(null);
      log(`Getting event history for vault #${id}...`);
      const cdp = await maker
        .service('mcd:cdpManager')
        .getCdp(id, { prefetch: false });
      if (isCancelled) return;
      const events = await maker.service('mcd:cdpManager').getEventHistory(cdp);
      if (isCancelled) return;
      log('Got events for #' + id, events);
      setEvents(events);
    }
    getHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => (isCancelled = true);
  }, [maker, id, txLastUpdate?.[id]]);

  return events;
}
