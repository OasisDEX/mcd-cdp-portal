import { useContext } from 'react';

import ilks from 'references/ilkList';
import { MakerObjectContext } from '../providers/MakerProvider';

export default function useCollateralTypes() {
  const { network } = useContext(MakerObjectContext);
  return ilks.filter(ilk => ilk.networks.includes(network));
}
