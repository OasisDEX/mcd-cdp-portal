import React from 'react';
import MakerProvider from '../../src/providers/MakerProvider';

export default function({ children, ...otherProps }) {
  return (
    <MakerProvider {...otherProps} network="testnet">
      {children}
    </MakerProvider>
  );
}
