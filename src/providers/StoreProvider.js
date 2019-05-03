import React, { createContext } from 'react';
import { useReducer } from 'reinspect';

export const StoreContext = createContext();
export const StoreProvider = ({ reducer, children }) => (
  <StoreContext.Provider
    value={useReducer(reducer, reducer({}, {}), () => ({}), 'StoreContext')}
  >
    {children}
  </StoreContext.Provider>
);
