import { useState } from 'react';

import useMaker from './useMaker';

function useMakerState(stateReadCb) {
  const { maker, authenticated } = useMaker();
  const [value, setValue] = useState(null);

  const read = async () => {
    if (!authenticated) await maker.authenticate();
    const _value = await stateReadCb(maker);
    setValue(_value);
    return _value;
  };

  const prefetch = async () => {
    if (!authenticated) await maker.authenticate();
    const _value = await stateReadCb(maker);
    setValue(_value);
  };

  return { read, value, prefetch };
}

export default useMakerState;
