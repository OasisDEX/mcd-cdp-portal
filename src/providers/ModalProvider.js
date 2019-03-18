import React, { createContext, useReducer } from 'react';
import styled from 'styled-components';
import { Flex } from '@makerdao/ui-components-core';

const BasicModal = ({ show, onClose, children }) => {
  const Bg = styled(Flex)`
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 10;
  `;
  if (!show) return null;

  return <Bg onClick={onClose}>{children}</Bg>;
};
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
  console.log('reducer', state);
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
  console.log('modal provider', children, modals);
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
      <BasicModal show={shouldShow} onClose={reset} {...modalProps}>
        {resolveModalTypeToComponent(modals, modalType, {
          ...modalData,
          onClose: reset
        })}
      </BasicModal>
      {children}
    </ModalStateContext.Provider>
  );
}

export { ModalStateContext, ModalProvider };
