import React from 'react';
import useScroll from 'hooks/useScroll';

const Parallaxed = ({ style, children, ...props }) => {
  const scrollY = useScroll();

  return (
    <div
      style={{ transform: `translateY(${scrollY / 14}px)`, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Parallaxed;
