import React, { createContext, useReducer } from 'react';
import sidebars from 'components/Sidebars';
import useToggle from 'hooks/useToggle';
import { Toggles } from 'utils/constants';

const initialState = { type: '', props: {} };

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

function SidebarProvider({ children }) {
  const [{ type, props }, dispatch] = useReducer(reducer, initialState);

  const { setToggle: setWalletBalancesCollapsed } = useToggle(
    Toggles.WALLETBALANCES
  );

  const reset = () => dispatch({ type: 'reset' });

  const show = ({ type, props, template }) => {
    setWalletBalancesCollapsed(true);
    dispatch({ type: 'show', payload: { type, props, template } });
  };

  const current = { component: sidebars[type], props: { ...props, reset } };

  return (
    <SidebarStateContext.Provider value={{ show, reset, current }}>
      {children}
    </SidebarStateContext.Provider>
  );
}

export { SidebarStateContext, SidebarProvider };
