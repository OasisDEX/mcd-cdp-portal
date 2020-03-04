import { useState, useEffect } from 'react';
import useMaker from 'hooks/useMaker';

export const useWeb3BlockHeight = (initialState = null) => {
  const { maker } = useMaker();
  const [blockHeight, setBlockHeight] = useState(initialState);
  if (!maker) return;
  if (!maker.service('web3')) return;

  maker.service('web3').onNewBlock(setBlockHeight);

  return blockHeight;
};

const useBlockHeight = (initialState = null) => {
  const { watcher } = useMaker();
  const [blockHeight, setBlockHeight] = useState(initialState);

  useEffect(() => {
    if (!watcher) return;
    const subscription = watcher.onNewBlock(blockHeight =>
      setBlockHeight(blockHeight)
    );
    return subscription.unsub;
  }, [watcher]);

  return blockHeight;
};

export default useBlockHeight;
