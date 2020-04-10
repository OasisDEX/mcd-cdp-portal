import config from 'references/config';

export function networkNameToId(networkName) {
  const entry = Object.entries(config.networkNames).find(
    ([, name]) => name === networkName
  );

  return entry ? entry[0] : null;
}

export function networkIdToName(networkId) {
  return config.networkNames[networkId];
}
