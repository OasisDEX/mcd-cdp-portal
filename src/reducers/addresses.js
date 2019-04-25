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
