import { useEffect, useState } from 'react';
import useMaker from 'hooks/useMaker';
import useInterval from 'hooks/useInterval';
import debug from 'debug';
const log = debug('maker:useEventHistory');

export default function useEventHistory(id) {
  const { maker, txLastUpdate } = useMaker();
  const [events, setEvents] = useState(null);
  const [pollCounter, setPollCounter] = useState(0);
  let isCancelled = false;

  useInterval(() => setPollCounter(pollCounter + 1), 5 * 1000);
  useEffect(() => {
    if (!maker) return;
    async function getHistory() {
      log(`Getting event history for vault #${id}...`);
      const cdp = await maker
        .service('mcd:cdpManager')
        .getCdp(id, { prefetch: false });
      if (isCancelled) return;
      const nextEvents = await maker
        .service('mcd:cdpManager')
        .getEventHistory(cdp);
      if (isCancelled) return;
      log('Got events for #' + id, nextEvents);
      if (events === null) setEvents(nextEvents);
      else if (events.length < nextEvents.length) {
        console.log('new events');
        setEvents(null);
        setEvents(nextEvents);
      }
    }
    getHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => (isCancelled = true);
  }, [
    maker,
    id,
    // txLastUpdate?.[id],
    pollCounter
  ]);
  return events;
}
