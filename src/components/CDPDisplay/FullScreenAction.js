import React from 'react';
import ReactDOM from 'react-dom';
import sidebars from '../Sidebars';
import { Box } from '@makerdao/ui-components-core';
import SidebarActionLayout from '../../layouts/SidebarActionLayout';

export default function FullScreenAction({ type, reset, props }) {
  const domNode = document.getElementById('portal1');
  const SidebarComponent = sidebars[type];
  return ReactDOM.createPortal(
    <Box
      css={`
        top: 0;
        left: 0;
      `}
      position="fixed"
      width="100vw"
      height="100vh"
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
