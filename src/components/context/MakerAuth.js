import React, { createContext } from 'react';

import maker from 'maker';

export const MakerAuthContext = createContext(false);

function MakerAuthProvider({ children }) {
  const [authenticated, setAuthenticated] = React.useState(false);

  React.useEffect(() => {
    // NOTE: this triggers authentication if it hasn't already been triggered;
    // if we don't want that, we need a different approach
    maker.authenticate().then(() => {
      setAuthenticated(true);
    });
  }, []);

  return (
    <MakerAuthContext.Provider value={authenticated}>
      {children}
    </MakerAuthContext.Provider>
  );
}

export default MakerAuthProvider;
