import React, { createContext, useReducer } from 'react';
import { Text, Card, Button } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';

const Claim = ({ colName, amount, symbol }) => {
  const { lang } = useLanguage();
  const message = lang.formatString(
    'Your {0} Vault auction(s) have completed. You have {1} {2} to claim',
    colName,
    amount,
    symbol
  );
  const buttonLabel = 'click';
  const onClick = () => console.log('ON CLICK WORKS');
  const ActionButton = ({ onClick }) => (
    <Button variant="secondary-outline" m=".5rem" p=".5rem" onClick={onClick}>
      <Text t="smallCaps">{buttonLabel}</Text>
    </Button>
  );
  return (
    <Card m="1rem" p="1rem" width="100%">
      <Text>{message}</Text>
      <ActionButton onClick={onClick} label={buttonLabel} />
    </Card>
  );
};

const BannerComponents = {
  claim: Claim
};

const initialState = { type: '', props: {}, banners: [] };

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
  const show = ({ type, props }) => {
    console.log('banner type:', type);
    dispatch({
      type: 'show',
      payload: { type, props }
    });
  };

  const Container = () => (
    <div>
      {banners.map(({ props }) => {
        const Comp = BannerComponents['claim'];
        console.log('comp', Comp);
        return <Comp key="b" {...props} />;
      })}
    </div>
  );

  // TODO make this nicer:
  const current = { component: Container, props: { ...props } };
  return (
    <BannerStateContext.Provider value={{ show, current, shouldShow }}>
      {children}
    </BannerStateContext.Provider>
  );
}

export { BannerStateContext, BannerProvider };
