import React, { useEffect, useRef } from 'react';

const Parallaxed = ({ children, initialOffset = 0, ...props }) => {
  const element = useRef(null);

  const scrollHandler = (() => {
    let prevTranslate;

    return () => {
      if (!element.current) {
        return;
      }

      const translate = Math.round((window.scrollY - initialOffset) / 8);
      if (translate === prevTranslate) {
        return;
      }
      prevTranslate = translate;
      element.current.style.transform = `translateY(${translate}px)`;
    };
  })();

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [scrollHandler]);

  return (
    <div ref={element} {...props}>
      {children}
    </div>
  );
};

export default Parallaxed;
