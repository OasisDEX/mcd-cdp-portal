import {} from 'reducers/system';

export function createCDPSystemModel(addresses) {
  return [].map(f => f(addresses));
}
