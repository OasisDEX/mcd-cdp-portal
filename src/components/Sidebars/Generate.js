import React, { useState } from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useCdp from 'hooks/useCdp';
import useLanguage from 'hooks/useLanguage';
import useMaker from '../../hooks/useMaker';

const Generate = ({ cdpId, reset }) => {
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();
  const [amount, setAmount] = useState('');

  const cdp = useCdp(cdpId);

  const dustLimit = cdp.dust || 0;
  const amountToGenerate = amount || 0;

  const cdpBelowDustLimit = cdp.debtValue.plus(amountToGenerate).lt(dustLimit);
  const cdpUnderCollateralized = cdp.daiAvailable().lt(amount);
  const failureMessage = cdpUnderCollateralized
    ? lang.action_sidebar.cdp_below_threshold
    : cdpBelowDustLimit
    ? lang.formatString(lang.cdp_create.below_dust_limit, dustLimit)
    : null;

  // verify we're doing the same as that calc cdp params function

  const generate = () => {
    newTxListener(
      maker.service('mcd:cdpManager').draw(cdpId, cdp.ilk, MDAI(amount)),
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
        <Button onClick={generate} disabled={!amount || failureMessage}>
          {lang.actions.generate}
        </Button>
        <Button variant="secondary-outline" onClick={reset}>
          {lang.cancel}
        </Button>
      </Grid>
      <InfoContainer>
        <Info
          title={lang.action_sidebar.maximum_available_to_generate}
          body={cdp.daiAvailable().toString()}
        />
        <Info
          title={lang.action_sidebar.new_liquidation_price}
          body={cdp.liquidationPrice({ dart: amountToGenerate }).toString()}
        />
        <Info
          title={lang.action_sidebar.new_collateralization_ratio}
          body={
            <Text color={cdpUnderCollateralized ? 'orange.600' : null}>
              {cdp
                .collateralizationRatio({ dart: amountToGenerate })
                .toString()}
            </Text>
          }
        />
      </InfoContainer>
    </Grid>
  );
};
export default Generate;
