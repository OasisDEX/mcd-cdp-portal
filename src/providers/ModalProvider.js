import React, { createContext, useReducer, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Flex } from '@makerdao/ui-components-core';
import { useSpring, animated, config } from 'react-spring';
const BasicModal = ({ show, onClose, modalData, children }) => {
  if (!show) return null;
  const [closing, setClosing] = useState(false);

  const Bg = styled(animated.div)`
    display: flex;
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 10;
  `;

  const animationStart = {
    opacity: 0,
    transform: 'scale(0.99) translate3d(0, 10px, 0)'
  };
  const animationEnd = {
    opacity: 1,
    transform: 'scale(1) translate3d(0, 0, 0)'
  };

  const animationProps = useSpring({
    to: closing ? animationStart : animationEnd,
    from: animationStart,
    config: config.stiff,
    onRest: () => {
      if (!closing) return false;
      onClose();
    }
  });

  const onCloseAnimated = () => {
    setClosing(true);
  };

  return (
    <Bg onClick={onCloseAnimated} style={animationProps}>
      {children({ ...modalData, onClose: onCloseAnimated })}
    </Bg>
  );
};
function resolveModalTypeToComponent(modals, type) {
  if (!modals || !type || !modals[type]) return null;

  return modals[type];
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
      <BasicModal
        show={shouldShow}
        onClose={reset}
        modalData={modalData}
        {...modalProps}
      >
        {resolveModalTypeToComponent(modals, modalType)}
      </BasicModal>
      {children}
    </ModalStateContext.Provider>
  );
}

export { ModalStateContext, ModalProvider };
