import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import sidebars from '../Sidebars';
import { Box } from '@makerdao/ui-components-core';
import SidebarActionLayout from '../../layouts/SidebarActionLayout';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

export default function FullScreenAction({ type, reset, props }) {
  const domNode = document.getElementById('portal1');
  const SidebarComponent = sidebars[type];
  const ref = useRef();

  useEffect(() => {
    const scrollable = ref.current;
    disableBodyScroll(scrollable);
    return () => enableBodyScroll(scrollable);
  }, []);

  return ReactDOM.createPortal(
    <Box
      ref={ref}
      css={`
        top: 0;
        left: 0;
      `}
      position="fixed"
      width="100vw"
      height="100%"
      overflow="scroll"
      bg="white"
    >
      <SidebarActionLayout onClose={reset} fullscreen={true}>
        <SidebarComponent {...{ ...props, reset }} />
      </SidebarActionLayout>
    </Box>,
    domNode
  );
}
