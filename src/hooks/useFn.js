import { useState } from 'react';

export default function useFn(fn) {
  const [val, setVal] = useState(() => fn);
  function setFunc(fn) {
    setVal(() => fn);
  }
  return [val, setFunc];
}
