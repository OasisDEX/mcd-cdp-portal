import config from 'references/config';

const { exTestchainApiUrl, networkNames } = config;

export async function getTestchainDetails(testchainId) {
  try {
    const rawRes = await fetch(`${exTestchainApiUrl}/${testchainId}`);
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
