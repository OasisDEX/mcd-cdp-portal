import React, { createContext } from 'react';
import { useReducer } from 'reinspect';
import { initialState as defaultInitialState } from '../reducers';

export const StoreContext = createContext();
const StoreProvider = ({ reducer, children, initialState }) => (
  <StoreContext.Provider
    value={useReducer(
      reducer,
      initialState || defaultInitialState,
      x => x,
      'StoreContext' // action names in Redux Dev Tools are prefixed with this
    )}
  >
    {children}
  </StoreContext.Provider>
);
export default StoreProvider;
