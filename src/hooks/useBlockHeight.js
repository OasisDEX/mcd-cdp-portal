import { useState, useEffect } from 'react';
import useMaker from 'hooks/useMaker';

export const useWeb3BlockHeight = (initialState = null) => {
  const { maker } = useMaker();
  const [blockHeight, setBlockHeight] = useState(initialState);
  useEffect(() => {
    if (!maker) return;
    if (!maker.service('web3')) return;
    const web3 = maker.service('web3');

    if (!web3._blockListeners['*']) web3._blockListeners['*'] = [];
    const listenersLength = web3._blockListeners['*'].push(setBlockHeight);
    return () => {
      web3._blockListeners['*'] = web3._blockListeners['*'].filter(
        (_, idx) => idx !== listenersLength - 1
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
