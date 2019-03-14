import cdpTypeWhitelist from 'references/cdpTypes';

export function getActionableIlks({ addresses }) {
  // in order to interact with the cdps of an ilk,
  // we need to ensure we have the following ilk-specific addresses
  return cdpTypeWhitelist.filter(({ gem }) => {
    const gemIsTransferable = !!addresses[gem];
    const gemIsJoinable = !!addresses['MCD_JOIN_' + gem];
    const gemHasPriceFeed = !!addresses['PIP_' + gem];
    return gemIsTransferable && gemIsJoinable && gemHasPriceFeed;
  });
}

function addresses(state = {}, action) {
  switch (action.type) {
    case 'addresses/set':
      return { ...action.payload.addresses };
    case 'addresses/clear':
      return {};
    default:
      return state;
  }
}

export default addresses;
