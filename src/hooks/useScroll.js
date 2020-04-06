import { useState, useEffect } from 'react';
import ScrollManager from 'window-scroll-manager';

const useScroll = () => {
  const [scroll, setScroll] = useState(0);

  new ScrollManager();

  useEffect(() => {
    window.addEventListener('window-scroll', scrollHandler);
    return () => {
      window.removeEventListener('window-scroll', scrollHandler);
    };
  });
  const scrollHandler = e => {
    requestAnimationFrame(() => setScroll(e.detail.scrollPositionY));
  };
  return scroll;
};

export default useScroll;
