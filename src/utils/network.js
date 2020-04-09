import config from 'references/config';

export function networkNameToId(networkName) {
  const entry = Object.entries(config.networkNames).find(
    ([, name]) => name === networkName
  );

  return entry
    ? entry[0]
    : config.otherDeployments[networkName]
    ? config.otherDeployments[networkName]
    : null;
}

export function networkIdToName(networkId) {
  return config.networkNames[networkId];
}
