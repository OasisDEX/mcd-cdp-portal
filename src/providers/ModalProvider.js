import React, { createContext, useReducer } from 'react';
import { Modal, Grid } from '@makerdao/ui-components-core';
import CDPCreate from 'components/CDPCreate';

function resolveModalTypeToComponent(type, props) {
  const typeToComponent = {
    cdpcreate: props => (
      <Grid gridRowGap="l" p="m" maxWidth="100%" width="95vw" height="90vh">
        <CDPCreate />
      </Grid>
    )
  };

  if (!type || !typeToComponent[type]) return null;

  return typeToComponent[type](props);
}

const initialState = {
  modalType: '',
  modalData: {},
  modalProps: {}
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

const ModalStateContext = createContext(initialState);

function ModalContextProvider({ children }) {
  const [{ modalType, modalData, modalProps }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const shouldShow = !!modalType;

  const reset = () => dispatch({ type: 'reset' });

  const show = ({ modalType, modalData, modalProps }) =>
    dispatch({ type: 'show', payload: { modalType, modalProps, modalData } });

  return (
    <ModalStateContext.Provider value={{ show, reset }}>
      <Modal show={shouldShow} onClose={reset} {...modalProps}>
        {resolveModalTypeToComponent(modalType, modalData)}
      </Modal>
      {children}
    </ModalStateContext.Provider>
  );
}

export { ModalStateContext, ModalContextProvider };
