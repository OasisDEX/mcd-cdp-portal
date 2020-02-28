/* eslint-disable */

// TODO: Add helpers to utils
function bytesToString(hex) {
  return Buffer.from(hex.toString().replace(/^0x/, ''), 'hex')
    .toString()
    .replace(/\x00/g, ''); // eslint-disable-line no-control-regex
}

export const proxy = {
  generate: address => ({
    id: `PROXY_REGISTRY.proxies(${address})`,
    contractName: 'PROXY_REGISTRY',
    call: ['proxies(address)(address)', address],
  }),
  returns: [['dsProxy']]
};

// getCdpsAsc(address manager, address guy) external view returns (uint[] memory ids, address[] memory urns, bytes32[] memory ilks)
export const getCdpIds = {
  generate: (manager, proxy) => ({
    id: `GET_CDPS.getCdpsAsc(${manager},${proxy})`,
    contractName: 'GET_CDPS',
    call: ['getCdpsAsc(address,address)(uint256[],address[],bytes32[])', manager, proxy],
  }),
  returns: [
    ['cdpIds', r => r.map(v => v.toNumber())],
    'cdpUrns',
    ['cdpIlks', r => r.map(bytesToString)]
  ]
};

export default {
  proxy,
  getCdpIds
};
