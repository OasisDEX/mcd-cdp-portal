import { useContext } from 'react';
import { watch } from 'hooks/useObservable';
import ilks from 'references/ilkList';
import { MakerObjectContext } from '../providers/MakerProvider';

export default function useCdpTypes() {
  const { network } = useContext(MakerObjectContext);

  const types = ilks.filter(ilk => ilk.networks.includes(network));
  const debtAvailableList = watch.collateralDebtAvailableList(
    types.map(type => type.symbol)
  );
  const ceilings = watch.collateralDebtCeilings(types.map(type => type.symbol));

  if (!ceilings || !debtAvailableList) {
    return { cdpTypes: [], cdpTypesList: [], gemTypeList: [] };
  }

  const cdpTypesWithNonZeroDebtCeilings = Object.entries(ceilings).reduce(
    (acc, [type, ceiling]) => {
      if (ceiling.gt(0) || !debtAvailableList[type].eq(0))
        return [...acc, type];
      return acc;
    },
    []
  );

  const cdpTypes = types.reduce((acc, type) => {
    if (cdpTypesWithNonZeroDebtCeilings.some(t => type.symbol === t))
      return [...acc, type];
    return acc;
  }, []);

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
