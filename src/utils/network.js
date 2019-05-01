import config from 'references/config';

const {
  exTestchainApiUrl,
  rpcUrls,
  supportedNetworkIds,
  networkNames
} = config;

export async function getTestchainDetails(testchainId) {
  console.log('testchainId', testchainId);
  try {
    console.log('fetchurl', `${exTestchainApiUrl}/${testchainId}`);
    const rawRes = await fetch(`http://localhost:4000/chain/${testchainId}`);
    // const rawRes = await fetch(`${exTestchainApiUrl}/${testchainId}`);
    console.log('raw res', rawRes);
    const { details } = await rawRes.json();
    const addresses = details.deploy_data;
    const rpcUrl = details.chain_details.rpc_url;
    return { rpcUrl, addresses, notFound: false };
  } catch (_) {
    return { rpcUrl: '', addresses: {}, notFound: true };
  }
}

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

  // if we have a testchain id, try to connect to an ex testchain instance
  if (testchainId !== undefined) {
    const { rpcUrl, addresses, notFound } = await getTestchainDetails(
      testchainId
    );

    if (notFound) throw new Error(`Testchain id ${testchainId} not found`);

    _cache[serializedKey] = { rpcUrl, addresses };
  } else {
    const networkId = networkNameToId(network);

    if (!supportedNetworkIds.includes(networkId))
      throw new Error(`Unsupported network: ${network}`);

    _cache[serializedKey] = {
      rpcUrl: rpcUrls[networkId]
    };
  }

  return _cache[serializedKey];
}
