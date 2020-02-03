import React, { useState } from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useLanguage from 'hooks/useLanguage';
import { formatCollateralizationRatio, formatter } from '../../utils/ui';
import useMaker from '../../hooks/useMaker';
import useAnalytics from 'hooks/useAnalytics';

const Generate = ({ vault, reset }) => {
  const { trackBtnClick } = useAnalytics('Generate', 'Sidebar');
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();
  const [amount, setAmount] = useState('');

  let { debtValue, daiAvailable, vaultType, debtFloor } = vault;

  const amountToGenerate = amount || 0;

  const cdpBelowDustLimit = debtValue.plus(amountToGenerate).lt(debtFloor);
  const cdpUnderCollateralized = daiAvailable.lt(amount);
  const failureMessage = cdpUnderCollateralized
    ? lang.action_sidebar.cdp_below_threshold
    : cdpBelowDustLimit
    ? lang.formatString(lang.cdp_create.below_dust_limit, debtFloor)
    : null;

  const generate = () => {
    newTxListener(
      maker.service('mcd:cdpManager').draw(vault.id, vaultType, MDAI(amount)),
      lang.transactions.generate_dai
    );
    reset();
  };

  return (
    <Grid gridRowGap="m">
      <Grid gridRowGap="s">
        <Text.h4 color="darkLavender">
          {lang.action_sidebar.generate_title}
        </Text.h4>
        <Text.p t="body">{lang.action_sidebar.generate_description}</Text.p>
        <Input
          type="number"
          value={amount}
          min="0"
          onChange={({ target }) => setAmount(target.value)}
          placeholder="0.00 DAI"
          failureMessage={failureMessage}
        />
      </Grid>
      <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
        <Button
          disabled={!amount || failureMessage}
          onClick={() => {
            trackBtnClick('Confirm', { amount });
            generate();
          }}
        >
          {lang.actions.generate}
        </Button>
        <Button
          variant="secondary-outline"
          onClick={() => {
            trackBtnClick('Cancel');
            reset();
          }}
        >
          {lang.cancel}
        </Button>
      </Grid>
      <InfoContainer>
        <Info
          title={lang.action_sidebar.maximum_available_to_generate}
          body={`${formatter(daiAvailable, { precision: 6 })} DAI`}
        />
        <Info
          title={lang.action_sidebar.new_liquidation_price}
          body={vault
            .calculateLiquidationPrice({
              debtValue: vault?.debtValue.plus(amountToGenerate)
            })
            ?.toString()}
        />
        <Info
          title={lang.action_sidebar.new_collateralization_ratio}
          body={
            <Text color={cdpUnderCollateralized ? 'orange.600' : null}>
              {formatCollateralizationRatio(
                vault.calculateCollateralizationRatio({
                  debtValue: vault?.debtValue.plus(amountToGenerate)
                })
              )}
            </Text>
          }
        />
      </InfoContainer>
    </Grid>
  );
};
export default Generate;
