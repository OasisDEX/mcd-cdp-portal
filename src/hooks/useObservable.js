/// <reference path="../../typings/main.d.ts" />
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
    const sub = multicall.watch(key, ...args).subscribe({
      next: val => {
        log('Got value from observable ' + key + ':', val);
        setValue(val);
      },
      error: val => {
        log('Got error from observable ' + key + ':', val);
        setValue(null);
      }
    });

    return () => {
      log(`Unsubscribed from observable ${key}(${args && args.join(',')})`);
      sub.unsubscribe();
      setValue(undefined);
    };
    // eslint-disable-next-line
  }, [maker, multicall?.watcher, key, ...args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg)]); // prettier-ignore

  return value;
}

export const watch = {};

export default useObservable;
