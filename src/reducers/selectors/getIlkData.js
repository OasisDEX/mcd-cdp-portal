import { getCurrency } from '../../utils/cdp';

export default function getIlkData(name, store) {
  const ilk = store.ilks[name];
  if (!ilk || !ilk.price) return null;
  return { ...ilk, name, currency: getCurrency({ ilk: name }) };
}
