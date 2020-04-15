import React from 'react';
import useScroll from 'hooks/useScroll';

const Parallaxed = ({ style, children, initialOffset = 0, ...props }) => {
  const scrollY = useScroll();

  return (
    <div
      style={{
        transform: `translateY(${Math.round((scrollY - initialOffset) / 8)}px)`,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Parallaxed;
