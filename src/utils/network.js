import config from 'references/config';

const { rpcUrls, supportedNetworkIds, networkNames } = config;

export function networkNameToId(networkName) {
  for (let [id, name] of Object.entries(networkNames)) {
    if (name === networkName) return id;
  }
  return undefined;
}

export function networkIdToName(networkId) {
  return networkNames[networkId];
}

const _cache = {};
export async function getOrFetchNetworkDetails({ network, testchainId }) {
  // is this a pair we've seen before?
  const serializedKey = JSON.stringify({ network, testchainId });
  if (_cache[serializedKey] !== undefined) return _cache[serializedKey];

  const networkId = networkNameToId(network);

  if (!supportedNetworkIds.includes(networkId))
    throw new Error(`Unsupported network: ${network}`);

  _cache[serializedKey] = {
    rpcUrl: rpcUrls[networkId]
  };

  return _cache[serializedKey];
}
