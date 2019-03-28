import React, { createContext, useState } from 'react';
import { mixpanelIdentify } from 'utils/analytics';

export const MakerObjectContext = createContext();

function MakerHooksProvider({ children, maker }) {
  const [account, setAccount] = useState(null);

  maker.on('accounts/CHANGE', eventObj => {
    const { account } = eventObj.payload;
    mixpanelIdentify(account, 'metamask');
    setAccount(account);
  });

  return (
    <MakerObjectContext.Provider value={{ maker, account }}>
      {children}
    </MakerObjectContext.Provider>
  );
}

export default MakerHooksProvider;
