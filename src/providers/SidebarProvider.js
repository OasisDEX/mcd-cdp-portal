import React, { createContext, useReducer } from 'react';

function resolveSidebarTypeToComponent(sidebars, type) {
  if (!sidebars || !type || !sidebars[type]) return null;

  return sidebars[type];
}

const initialState = {
  sidebarType: 'global',
  sidebarProps: {}
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'show':
      return { ...state, ...payload };
    case 'reset':
      return { ...initialState };
    default:
      return;
  }
};

const SidebarStateContext = createContext(initialState);

function SidebarProvider({ children, sidebars }) {
  const [{ sidebarType, sidebarProps }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const reset = () => dispatch({ type: 'reset' });

  const show = ({ sidebarType, sidebarProps, sidebarTemplate }) =>
    dispatch({
      type: 'show',
      payload: { sidebarType, sidebarProps, sidebarTemplate }
    });

  const current = {
    component: resolveSidebarTypeToComponent(sidebars, sidebarType),
    props: { ...sidebarProps, reset }
  };

  return (
    <SidebarStateContext.Provider value={{ show, reset, current }}>
      {children}
    </SidebarStateContext.Provider>
  );
}

export { SidebarStateContext, SidebarProvider };
