import React from 'react';
import { watch } from 'hooks/useObservable';
import useLanguage from 'hooks/useLanguage';
import { Text } from '@makerdao/ui-components-core';

function NextPriceLiquidation({ vaultType, collateral, debt }) {
  const { lang } = useLanguage();
  const gem = vaultType.split('-')[0];
  const nextPriceUpdate = watch.tokenPriceNextUpdate(gem);

  return (
    <Text.p>
      {lang.formatString(
        lang.notifications.vault_below_next_price,
        vaultType,
        nextPriceUpdate
          ? nextPriceUpdate.toTimeString().split(' ')[0]
          : '-- : --',
        `${collateral} ${gem}`,
        `${debt} DAI`
      )}
    </Text.p>
  );
}

export default NextPriceLiquidation;
