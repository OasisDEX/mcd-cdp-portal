import ilks from 'references/ilks';

export const ADDRESSES_SET = 'addresses/set';
export const ADDRESSES_CLEAR = 'addresses/clear';

export function getActionableIlks({ addresses }) {
  // in order to interact with the cdps of an ilk,
  // we need to ensure we have the following ilk-specific addresses
  return ilks.filter(({ gem, key: ilk }) => {
    const gemIsTransferable = !!addresses[gem] || !!addresses[ilk];
    const gemIsJoinable = !!addresses['MCD_JOIN_' + ilk];
    const gemHasPriceFeed = !!addresses['PIP_' + gem];
    return gemIsTransferable && gemIsJoinable && gemHasPriceFeed;
  });
}

export function getGemAddress({ addresses }, gem) {
  if (gem === 'MKR' && addresses['MCD_GOV']) return addresses['MCD_GOV'];
  else return addresses[gem] || null;
}

function addresses(state = {}, action) {
  switch (action.type) {
    case ADDRESSES_SET:
      return { ...action.payload.addresses };
    case ADDRESSES_CLEAR:
      return {};
    default:
      return state;
  }
}

export default addresses;
