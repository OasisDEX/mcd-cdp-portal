import React, { createContext, useReducer } from 'react';

const ToggleStateContext = createContext({});

function ToggleProvider({ children }) {
  const [toggleState, updateToggleState] = useReducer(
    (prevState, { id, state }) => ({ ...prevState, [id]: !!state }),
    {}
  );

  return (
    <ToggleStateContext.Provider value={{ toggleState, updateToggleState }}>
      {children}
    </ToggleStateContext.Provider>
  );
}

export { ToggleStateContext, ToggleProvider };
