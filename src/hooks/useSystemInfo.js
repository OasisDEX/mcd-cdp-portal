import { useState, useEffect } from 'react';
import useStore from 'hooks/useStore';
// import useMaker from 'hooks/useMaker';

const useSystemInfo = () => {
  // const { maker } = useMaker();
  const [{ system }] = useStore();
  const [systemInfo, setSystemInfo] = useState([]);

  // TODO: Hook into SystemDataService state updates via SDK
  useEffect(() => {
    // console.debug('[useSystemInfo] useEffect', system);
    setSystemInfo(system);
    // return maker.service('mcd:systemData').onChange();
  }, [system]);

  return systemInfo;
};

export default useSystemInfo;
