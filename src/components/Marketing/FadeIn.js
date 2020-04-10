import React, { useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import styled from 'styled-components';

const FadeInStyle = styled.div`
  transition: all ${props => props.duration} ease-out;
  opacity: 0;
  transform: translateY(${props => props.moveDistance});

  &.animating {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FadeIn = ({
  triggerOffset = -20,
  moveDistance = '40%',
  duration = '0.7s',
  children,
  ...props
}) => {
  const [animate, setAnimate] = useState(false);

  return (
    <VisibilitySensor
      active={!animate}
      onChange={isVisible => {
        if (isVisible) {
          setAnimate(true);
        }
      }}
      partialVisibility={true}
      offset={{ bottom: triggerOffset }}
      {...props}
    >
      <FadeInStyle
        className={animate ? 'animating' : ''}
        moveDistance={moveDistance}
        duration={duration}
      >
        {children}
      </FadeInStyle>
    </VisibilitySensor>
  );
};

export default FadeIn;
