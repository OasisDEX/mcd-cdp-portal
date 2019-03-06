import { useState, useEffect } from 'react';

import useMaker from './useMaker';

const INTERVAL = 2500;

function useMakerState(stateReadCb) {
  const { maker, authenticated } = useMaker();
  const [value, setValue] = useState(null);
  const [isPolling, setIsPolling] = useState(null);

  const read = async () => {
    if (!authenticated) await maker.authenticate();
    const _value = await stateReadCb(maker);
    setValue(_value);
    return _value;
  };

  const poll = () => {
    setIsPolling(true);
  };

  const halt = () => {
    setIsPolling(false);
  };

  useEffect(() => {
    if (isPolling) {
      let _pollId;
      const get = () => {
        _pollId = setTimeout(() => read().then(() => get()), INTERVAL);
      };
      return () => {
        clearTimeout(_pollId);
      };
    }
  }, [isPolling]);

  return { read, value, poll, halt };
}

export default useMakerState;
