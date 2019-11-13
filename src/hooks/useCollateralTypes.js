import { useContext } from 'react';

import ilks from 'references/ilkList';
import { MakerObjectContext } from '../providers/MakerProvider';

export default function useCollateralTypes() {
  const { network } = useContext(MakerObjectContext);
  console.log('NETWORK', network);
  const collateralTypes = ilks.filter(ilk => ilk.networks.includes(network));

  const collateralList = collateralTypes.reduce((acc, type) => {
    if (!acc.includes(type.key)) acc.push(type.key);
    return acc;
  }, []);

  console.log('**^^', collateralList);

  return { collateralTypes, collateralList };
}
