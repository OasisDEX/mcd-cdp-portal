import React from 'react';
import useScroll from 'hooks/useScroll';

const Parallaxed = ({ style, children, initialOffset = 0, ...props }) => {
  const scrollY = useScroll();

  return (
    <div
      style={{
        transform: `translateY(${(scrollY - initialOffset) / 14}px)`,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Parallaxed;
