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
  amount: unlockedCollateral
}) => {
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();
  //TODO: only show the button if active user === owner
  const showButton = true;

  const reclaimCollateral = async () => {
    const txObject = maker
      .service('mcd:cdpManager')
      .reclaimCollateral(cdpId, unlockedCollateral.toNumber(), 0);
    newTxListener(txObject, lang.notifications.claiming_collateral);
  };

  const message = lang.formatString(
    lang.notifications.claim,
    gem,
    unlockedCollateral.toFixed(7),
    gem
  );

  return (
    <Card my="1rem" p="1rem" width="100%">
      <Text>{message}</Text>
      {showButton && (
        <ActionButton
          disabled={true}
          onClick={reclaimCollateral}
          label="CLAIM"
        />
      )}
    </Card>
  );
};

export default CollateralClaim;
