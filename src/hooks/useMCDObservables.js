import { useEffect, useState } from 'react';
import useMaker from 'hooks/useMaker';

function useMCDObservables({ ilkName, vaultId }) {
  const { maker } = useMaker();
  const [encumberedCollateral, setEncumberedCollateral] = useState('');
  const [encumberedDebt, setEncumberedDebt] = useState('');
  const [debtScalingFactor, setDebtScalingFactor] = useState('');
  const [daiGenerated, setDaiGenerated] = useState('');

  useEffect(() => {
    const obs = path =>
      maker.service('multicall').getObservable(path.join('.'));
    const subscriptions = [
      obs(['encumberedCollateral', vaultId])?.subscribe(val =>
        setEncumberedCollateral(val.toString())
      ),
      obs(['encumberedDebt', vaultId])?.subscribe(val =>
        setEncumberedDebt(val.toString())
      ),
      obs(['debtScalingFactor', ilkName])?.subscribe(val =>
        setDebtScalingFactor(val.toString())
      ),
      obs(['daiGenerated', vaultId])?.subscribe(val =>
        setDaiGenerated(val.toString())
      )
    ];

    return () => subscriptions.map(sub => sub?.unsubscribe());
  }, [maker, ilkName, vaultId]);

  return {
    encumberedCollateral,
    encumberedDebt,
    debtScalingFactor,
    daiGenerated
  };
}

export default useMCDObservables;
