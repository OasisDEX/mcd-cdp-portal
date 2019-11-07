import React, { createContext, useReducer } from 'react';
import { Text, Card, Button } from '@makerdao/ui-components-core';

const Claim = ({ message, buttonLabel, onClick }) => {
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

const banners = {
  claim: Claim
};

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

const BannerStateContext = createContext(initialState);

function BannerProvider({ children }) {
  const [{ type, props }, dispatch] = useReducer(reducer, initialState);

  const shouldShow = !!type;

  const show = ({ type, props }) => {
    console.log(
      'type passed (takes no effect bc were hardcoding BannerComponent for now',
      type
    );
    dispatch({
      type: 'show',
      payload: { type, props }
    });
  };

  const current = { component: banners[type], props: { ...props } };

  return (
    <BannerStateContext.Provider value={{ show, current, shouldShow }}>
      {children}
    </BannerStateContext.Provider>
  );
}

export { BannerStateContext, BannerProvider };
