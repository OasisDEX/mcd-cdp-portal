import { useEffect, useState } from 'react';
import useMaker from 'hooks/useMaker';
import findIndex from 'lodash/findIndex';
import debug from 'debug';
const log = debug('hook:useObservable');

function useObservable(key, ...args) {
  const { maker } = useMaker();
  const multicall = maker.service('multicall');
  const [value, setValue] = useState(undefined);

  useEffect(() => {
    if (!maker || !multicall.watcher) return;
    if (findIndex(args, arg => typeof arg === 'undefined') !== -1) return;

    log(`Subscribed to observable ${key}(${args && args.join(',')})`);
    const sub = multicall.watchObservable(key, ...args).subscribe(val => {
      log(`Got value for observable ${key}: ${val}`);
      setValue(val);
    });

    return () => {
      log(`Unsubscribed from observable ${key}(${args && args.join(',')})`);
      sub.unsubscribe();
    };
  }, [maker, multicall.watcher, key, ...args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg)]); // eslint-disable-line

  return value;
}

export const watch = {};

export default useObservable;
