import React from 'react';
import { Text, Card, Button } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';
import useMaker from 'hooks/useMaker';

const CollateralClaim = ({ colName, amount, symbol }) => {
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();

  const frobToOwnUrn = async () => {
    //TODO need to fix re-render infinite loop to pass in real props
    const cdpId = 183;
    const amount = 0.08;

    const txObject = maker.service('mcd:cdpManager').frob(cdpId, amount, 0);
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
    colName,
    amount,
    symbol
  );
  const buttonLabel = 'claim';

  const ActionButton = ({ onClick }) => (
    <Button variant="secondary-outline" m=".5rem" p=".5rem" onClick={onClick}>
      <Text t="smallCaps">{buttonLabel}</Text>
    </Button>
  );

  return (
    <Card my="1rem" p="1rem" width="100%">
      <Text>{message}</Text>
      {frobToOwnUrn && (
        <ActionButton onClick={frobToOwnUrn} label={buttonLabel} />
      )}
    </Card>
  );
};

export default CollateralClaim;
