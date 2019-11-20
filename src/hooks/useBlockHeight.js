import { useState, useEffect } from 'react';
import useMaker from 'hooks/useMaker';

const useBlockHeight = (initialState = null) => {
  const { watcher } = useMaker();
  const [blockHeight, setBlockHeight] = useState(initialState);

  useEffect(() => {
    if (!watcher) return;
    const subscription = watcher.onNewBlock(blockHeight => setBlockHeight(blockHeight));
    return subscription.unsub;
  }, [watcher]);

  return blockHeight;
};

export default useBlockHeight;
