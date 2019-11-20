import React from 'react';
import MakerProvider from '../../src/providers/MakerProvider';
import useMaker from '../../src/hooks/useMaker';
import { ToggleProvider } from '../../src/providers/ToggleProvider';

const WaitForMaker = ({ children }) => (useMaker().maker ? children : null);

export default function({ children, waitForAuth, ...otherProps }) {
  return (
    <MakerProvider {...otherProps} network="testnet">
      <ToggleProvider>
        {waitForAuth ? <WaitForMaker>{children}</WaitForMaker> : children}
      </ToggleProvider>
    </MakerProvider>
  );
}
