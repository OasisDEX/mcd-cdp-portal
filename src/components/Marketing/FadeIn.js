import React, { useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import styled from 'styled-components';

const FadeInStyle = styled.div`
  transition: all 0.7s ease-out;
  opacity: 0;
  transform: translateY(${props => props.moveDistance});

  &.animating {
    animation-name: fadeInBottom;
    opacity: 1;
    transform: translateY(0);
  }
`;

const FadeIn = ({
  minVisibleToAppear = 70,
  moveDistance = '15%',
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
      offset={{ bottom: minVisibleToAppear }}
      {...props}
    >
      <FadeInStyle
        className={animate ? 'animating' : ''}
        moveDistance={moveDistance}
      >
        {children}
      </FadeInStyle>
    </VisibilitySensor>
  );
};

export default FadeIn;
