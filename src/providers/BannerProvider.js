import React, { createContext, useReducer } from 'react';
import bannerComponents from 'components/Banners';

const initialState = {
  banners: {},
  viewable: true
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'show':
      return { ...state, banners: { ...state.banners, ...payload } };
    case 'reset':
      return { ...initialState };
    default:
      return;
  }
};

const BannerStateContext = createContext(initialState);

function BannerProvider({ children }) {
  const [{ viewable, banners }, dispatch] = useReducer(reducer, initialState);

  const bannerEntries = Object.entries(banners);
  const shouldShow = viewable && bannerEntries.length > 0;
  const reset = () => dispatch({ type: 'reset' });

  const show = ({ banner, props }) => {
    dispatch({
      type: 'show',
      payload: { [banner]: props }
    });
  };

  const Container = () => (
    <div>
      {bannerEntries.map(([banner, props], index) => {
        const Comp = bannerComponents[banner];
        return <Comp key={index} {...props} />;
      })}
    </div>
  );

  const current = { component: Container };

  return (
    <BannerStateContext.Provider value={{ show, current, shouldShow, reset }}>
      {children}
    </BannerStateContext.Provider>
  );
}

export { BannerStateContext, BannerProvider };
