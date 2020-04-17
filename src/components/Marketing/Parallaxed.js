import React, { useEffect, useRef } from 'react';
import ScrollManager from 'window-scroll-manager';

const Parallaxed = ({ children, initialOffset = 0, ...props }) => {
  const element = useRef(null);

  const scrollHandler = (() => {
    let prevTranslate;

    return e => {
      if (!element.current) {
        return;
      }

      const translate =
        Math.round((e.detail.scrollPositionY - initialOffset) / 4) / 2;
      if (translate === prevTranslate) {
        return;
      }
      prevTranslate = translate;
      element.current.style.transform = `translateY(${translate}px)`;
    };
  })();

  useEffect(() => {
    new ScrollManager();
    window.addEventListener('window-scroll', scrollHandler);
    return () => {
      window.removeEventListener('window-scroll', scrollHandler);
    };
  }, [scrollHandler]);

  return (
    <div ref={element} {...props}>
      {children}
    </div>
  );
};

export default Parallaxed;
