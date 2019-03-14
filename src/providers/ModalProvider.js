import React, { createContext, useReducer } from 'react';
import { Modal } from '@makerdao/ui-components-core';

function resolveModalTypeToComponent(modals, type, props) {
  if (!modals || !type || !modals[type]) return null;

  return modals[type](props);
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

function ModalProvider({ children, modals }) {
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
        {resolveModalTypeToComponent(modals, modalType, modalData)}
      </Modal>
      {children}
    </ModalStateContext.Provider>
  );
}

export { ModalStateContext, ModalProvider };
