export const PROXY_CREATED = 'ProxyCreated';
export const ADDRESS_CHANGED = 'AddressChanged';
export const NETWORK_CHANGED = 'NetworkChanged';

const initialState = {
  addresses: [],
  address: null,
  proxyAddress: null
};

function app(state = initialState, action) {
  switch (action.type) {
    case NETWORK_CHANGED:
      return {
        ...state,
        addresses: action.payload.addresses
      };
    case PROXY_CREATED:
      return {
        ...state,
        proxyAddress: action.payload.address
      };
    case ADDRESS_CHANGED:
      return {
        ...state,
        proxyAddress: action.payload.proxyAddress,
        address: action.payload.address
      };
    default:
      return state;
  }
}

export default app;
