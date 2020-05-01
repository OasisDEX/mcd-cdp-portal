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
  triggerOffset = 0, // extra pixels you need to scroll down in order for the animation to trigger
  moveDistance = '30%',
  duration = '1s',
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
      <div>
        {/*
        This div wrapper is for triggering the visibility sensor,
        ignoring moveDistance.
       */}
        <FadeInStyle
          className={animate ? 'animating' : ''}
          moveDistance={moveDistance}
          duration={duration}
        >
          {children}
        </FadeInStyle>
      </div>
    </VisibilitySensor>
  );
};

export default FadeIn;
