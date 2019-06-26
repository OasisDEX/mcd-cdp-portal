import { useEffect, useState } from 'react';

const useBrowserProvider = () => {
  const [activeAccountAddress, setActiveAccountAddress] = useState(null);

  useEffect(() => {
    if (typeof window.ethereum === 'undefined') return;

    if (window.ethereum.selectedAddress)
      setActiveAccountAddress(window.ethereum.selectedAddress);

    if (window.ethereum.on) {
      window.ethereum.on('accountsChanged', accounts => {
        if (accounts.length <= 0) return;
        setActiveAccountAddress(accounts[0]);
      });
    }
  }, []);

  return { activeAccountAddress };
};

export default useBrowserProvider;
