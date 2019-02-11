import React, { createContext } from 'react';
import { getMaker } from 'maker';

export const MakerAuthContext = createContext(false);

function MakerAuthProvider({ children }) {
  const [authenticated, setAuthenticated] = React.useState(false);

  React.useEffect(() => {
    getMaker()
      .authenticate()
      .then(() => {
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
