import React, { createContext, useReducer, useEffect } from 'react';
import sidebars from 'components/Sidebars';
import useToggle from 'hooks/useToggle';
import { Toggles } from 'utils/constants';
import { useCurrentRoute } from 'react-navi';

const initialState = { type: '', props: {} };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'show':
      return { ...state, ...payload };
    case 'reset':
      return { ...state, ...initialState };
    case 'update-route':
      return { ...state, lastPathname: payload };
    default:
      return;
  }
};

const SidebarStateContext = createContext(initialState);

function SidebarProvider({ children }) {
  const [{ type, props, lastPathname }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const { setToggle: setWalletBalancesCollapsed } = useToggle(
    Toggles.WALLETBALANCES
  );

  const reset = () => dispatch({ type: 'reset' });

  const show = ({ type, props, template }) => {
    setWalletBalancesCollapsed(true);
    dispatch({ type: 'show', payload: { type, props, template } });
  };

  const current = { component: sidebars[type], props: { ...props, reset } };

  // close the sidebar whenever the route changes
  const { pathname } = useCurrentRoute().url;
  useEffect(() => {
    if (pathname !== lastPathname) {
      dispatch({ type: 'update-route', payload: pathname });
      if (type !== '') reset();
    }
  }, [pathname, type, lastPathname]);

  return (
    <SidebarStateContext.Provider value={{ show, reset, current }}>
      {children}
    </SidebarStateContext.Provider>
  );
}

export { SidebarStateContext, SidebarProvider };
