import { useContext, useCallback } from 'react';

import ilks from 'references/ilkList';
import { MakerObjectContext } from '../providers/MakerProvider';

export default function useCdpTypes() {
  const { network } = useContext(MakerObjectContext);
  const cdpTypes = useCallback(
    ilks.filter(ilk => ilk.networks.includes(network)),
    [ilks]
  );

  const cdpTypesList = cdpTypes.reduce((acc, type) => {
    if (!acc.includes(type.key)) acc.push(type.key);
    return acc;
  }, []);

  return { cdpTypes, cdpTypesList };
}
