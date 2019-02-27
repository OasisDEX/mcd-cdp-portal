import React, { createContext } from 'react';

export const MakerObjectContext = createContext();

function MakerHooksProvider({ children, maker }) {
  return (
    <MakerObjectContext.Provider value={maker}>
      {children}
    </MakerObjectContext.Provider>
  );
}

export default MakerHooksProvider;
