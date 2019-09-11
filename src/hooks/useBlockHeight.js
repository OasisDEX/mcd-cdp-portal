import { useState, useEffect } from 'react';
import useMaker from 'hooks/useMaker';

const useBlockHeight = () => {
  const { maker } = useMaker();
  const [blockHeight, setblockHeight] = useState([]);

  useEffect(() => {
    if (window.watcher) {
      const subscription = window.watcher.onNewBlock(blockHeight => {
        setblockHeight(blockHeight);
      });
      return subscription.unsub;
    }
  }, [maker]);

  return blockHeight;
};

export default useBlockHeight;
