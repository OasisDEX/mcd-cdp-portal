import React, { createContext, useReducer, useState } from 'react';
import styled from 'styled-components';
import { useSpring, animated, config } from 'react-spring';

const FullscreenModal = ({ show, onClose, modalData, children }) => {
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
  modalProps: {},
  modalTemplate: ''
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

const SuperBasicModal = ({ show, onClose, modalData, children }) => {
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
    align-items: center;
    justify-content: center;
  `;

  const ModalContent = styled(animated.div)`
    display: flex;
    box-shadow: 1px 1px 3px black;
    background-color: white;
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
      <ModalContent>
        {children({ ...modalData, onClose: onCloseAnimated })}
      </ModalContent>
    </Bg>
  );
};
function resolveModalTemplateToComponent(template) {
  const templates = {
    simple: SuperBasicModal,
    fullscreen: FullscreenModal
  };

  return templates[template] || SuperBasicModal;
}

function ModalProvider({ children, modals }) {
  const [
    { modalType, modalData, modalProps, modalTemplate },
    dispatch
  ] = useReducer(reducer, initialState);
  const shouldShow = !!modalType;

  const reset = () => dispatch({ type: 'reset' });

  const show = ({ modalType, modalData, modalProps, modalTemplate }) =>
    dispatch({
      type: 'show',
      payload: { modalType, modalProps, modalData, modalTemplate }
    });

  const WrapperComponent = resolveModalTemplateToComponent(modalTemplate);

  return (
    <ModalStateContext.Provider value={{ show, reset }}>
      <WrapperComponent
        show={shouldShow}
        onClose={reset}
        modalData={modalData}
        {...modalProps}
      >
        {resolveModalTypeToComponent(modals, modalType)}
      </WrapperComponent>
      {children}
    </ModalStateContext.Provider>
  );
}

export { ModalStateContext, ModalProvider };
