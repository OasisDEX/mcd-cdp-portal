import { useContext } from 'react';

import ilks from 'references/ilkList';
import { MakerObjectContext } from '../providers/MakerProvider';

export default function useCdpTypes() {
  const { network } = useContext(MakerObjectContext);
  const cdpTypes = ilks.filter(ilk => ilk.networks.includes(network));
  const cdpTypesList = cdpTypes.reduce((acc, type) => {
    if (!acc.includes(type.key)) acc.push(type.key);
    return acc;
  }, []);
  const gemTypeList = cdpTypes.reduce((acc, type) => {
    if (!acc.includes(type.gem)) acc.push(type.gem);
    return acc;
  }, []);
  return { cdpTypes, cdpTypesList, gemTypeList };
}
