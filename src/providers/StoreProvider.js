import React, { createContext } from 'react';
import { useReducer } from 'reinspect';

import { initialState } from '../reducers/cdps';

export const StoreContext = createContext();
export const StoreProvider = ({ reducer, children }) => (
  <StoreContext.Provider
    value={useReducer(
      reducer,
      reducer({}, {}, initialState),
      () => ({}),
      'StoreContext'
    )}
  >
    {children}
  </StoreContext.Provider>
);
