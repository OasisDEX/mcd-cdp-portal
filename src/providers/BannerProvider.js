import React, { createContext, useReducer } from 'react';
import bannerComponents from 'components/Banners';

const initialState = { type: '', banners: [] };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'show':
      return { ...state, type, banners: [...state.banners, payload] };
    case 'reset':
      return { ...initialState };
    default:
      return;
  }
};

const BannerStateContext = createContext(initialState);

function BannerProvider({ children }) {
  const [{ type, props, banners }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const shouldShow = banners.length > 0;

  const reset = () => dispatch({ type: 'reset' });

  const show = ({ type, props }) => {
    dispatch({
      type: 'show',
      payload: { type, props }
    });
  };

  const Container = () => (
    <div>
      {banners.map(({ props }, index) => {
        const Comp = bannerComponents['claim'];
        return <Comp key={index} {...props} />;
      })}
    </div>
  );

  // TODO make this nicer:
  const current = { component: Container, props: { ...props } };
  return (
    <BannerStateContext.Provider value={{ show, current, shouldShow, reset }}>
      {children}
    </BannerStateContext.Provider>
  );
}

export { BannerStateContext, BannerProvider };
