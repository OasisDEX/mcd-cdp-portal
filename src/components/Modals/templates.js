import React from 'react';
import styled from 'styled-components';
import { useSpring, animated, config } from 'react-spring';

const animations = {
  fade: [{ opacity: 0 }, { opacity: 1 }],
  fadeUp: [
    {
      opacity: 0,
      transform: 'scale(0.99) translate3d(0, 10px, 0)'
    },
    {
      opacity: 1,
      transform: 'scale(1) translate3d(0, 0, 0)'
    }
  ]
};

const Bg = styled(animated.div)`
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 10;
`;

const FullscreenModal = ({ show, onClose, modalProps, children }) => {
  if (!show) return null;
  const [fadeUpStart, fadeUpEnd] = animations.fadeUp;

  const [animationProps, setBgAnimation] = useSpring(() => ({
    to: fadeUpEnd,
    from: fadeUpStart,
    config: config.stiff
  }));

  const onCloseAnimated = () => {
    setBgAnimation({
      to: fadeUpStart,
      onRest() {
        onClose();
      }
    });
  };

  return (
    <Bg onClick={onCloseAnimated}>
      {children({ ...modalProps, onClose: onCloseAnimated, animationProps })}
    </Bg>
  );
};

const BasicModal = ({ show, onClose, modalProps, children }) => {
  if (!show) return null;
  const [fadeStart, fadeEnd] = animations.fade;
  const [fadeUpStart, fadeUpEnd] = animations.fadeUp;

  const ModalContent = styled(animated.div)`
    background-color: white;
    border-radius: 6px;
    padding: ${({ theme }) => theme.space.m};
    box-shadow: 0px 3px 13px rgba(67, 67, 67, 0.13);
  `;

  const [bgAnimation, setBgAnimation] = useSpring(() => ({
    to: fadeEnd,
    from: fadeStart,
    config: config.stiff
  }));

  const [contentAnimation, setContentAnimation] = useSpring(() => ({
    to: fadeUpEnd,
    from: fadeUpStart,
    config: config.stiff
  }));

  const onCloseAnimated = () => {
    setBgAnimation({
      to: fadeStart
    });

    setContentAnimation({
      to: fadeUpStart,
      onRest() {
        onClose();
      }
    });
  };

  return (
    <Bg
      onClick={onCloseAnimated}
      css={{
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
      }}
      style={bgAnimation}
    >
      <ModalContent style={contentAnimation} onClick={e => e.stopPropagation()}>
        {children({ ...modalProps, onClose: onCloseAnimated })}
      </ModalContent>
    </Bg>
  );
};

const templates = {
  fullscreen: FullscreenModal,
  basic: BasicModal,
  default: BasicModal
};

export default templates;
