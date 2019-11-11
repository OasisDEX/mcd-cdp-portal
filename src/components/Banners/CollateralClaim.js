import React from 'react';
import { Text, Card, Button } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';
import useMaker from 'hooks/useMaker';

const ActionButton = ({ onClick, label }) => (
  <Button variant="secondary-outline" m=".5rem" p=".5rem" onClick={onClick}>
    <Text t="smallCaps">{label}</Text>
  </Button>
);

const CollateralClaim = ({
  cdpId,
  colName: gem,
  amount: unlockedCollateral,
  symbol
}) => {
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();

  const reclaimCollateral = async () => {
    const txObject = maker
      .service('mcd:cdpManager')
      .reclaimCollateral(cdpId, unlockedCollateral, 0);
    newTxListener(txObject, 'Testing frob Tx');

    const txMgr = maker.service('transactionManager');
    txMgr.listen(txObject, {
      pending: tx => console.log('pendingTx', tx),
      confirmed: () => console.log('confirmed'),
      error: (e, t) => console.log('et', e, t)
    });
  };

  const message = lang.formatString(
    'Your {0} Vault auction(s) have completed. You have {1} {2} to claim',
    gem,
    unlockedCollateral.toFixed(7),
    gem
  );

  return (
    <Card my="1rem" p="1rem" width="100%">
      <Text>{message}</Text>
      {reclaimCollateral && (
        <ActionButton onClick={reclaimCollateral} label="CLAIM" />
      )}
    </Card>
  );
};

export default CollateralClaim;
