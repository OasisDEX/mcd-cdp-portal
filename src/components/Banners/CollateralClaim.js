import React from 'react';
import { Text, Card, Button } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';

const CollateralClaim = ({ colName, amount, symbol }) => {
  const { lang } = useLanguage();
  const message = lang.formatString(
    'Your {0} Vault auction(s) have completed. You have {1} {2} to claim',
    colName,
    amount,
    symbol
  );
  const buttonLabel = 'claim';
  //TODO this should 'frob' 'amount' back to the CDP
  const onClick = () => console.log('ON CLICK WORKS');

  const ActionButton = ({ onClick }) => (
    <Button variant="secondary-outline" m=".5rem" p=".5rem" onClick={onClick}>
      <Text t="smallCaps">{buttonLabel}</Text>
    </Button>
  );

  return (
    <Card m="1rem" p="1rem" width="100%">
      <Text>{message}</Text>
      {onClick && <ActionButton onClick={onClick} label={buttonLabel} />}
    </Card>
  );
};

export default CollateralClaim;
