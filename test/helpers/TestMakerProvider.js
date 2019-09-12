import React from 'react';
import MakerProvider from '../../src/providers/MakerProvider';
import useMaker from '../../src/hooks/useMaker';
import EthBalanceProvider from '../../src/providers/EthBalanceProvider';

const WaitForMaker = ({ children }) => (useMaker().maker ? children : null);

export default function({ children, waitForAuth, ...otherProps }) {
  return (
    <MakerProvider {...otherProps} network="testnet">
      <EthBalanceProvider>
        {waitForAuth ? <WaitForMaker>{children}</WaitForMaker> : children}
      </EthBalanceProvider>
    </MakerProvider>
  );
}
