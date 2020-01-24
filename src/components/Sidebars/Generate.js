import React, { useState } from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
// import useCdp from 'hooks/useCdp';
import useLanguage from 'hooks/useLanguage';
// import useAnalytics from 'hooks/useAnalytics';
import { formatCollateralizationRatio, safeToFixed } from '../../utils/ui';
import useMaker from '../../hooks/useMaker';
import { watch } from 'hooks/useObservable';
import { formatValue } from '../CDPDisplay/Presentation';

const Generate = ({ cdpId, reset }) => {
  // const { trackBtnClick } = useAnalytics('Generate', 'Sidebar');
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();
  const [amount, setAmount] = useState('');

  const vault = watch.vault(1);
  if (!vault) return null;
  console.log('^^vault', vault);
  let { debtValue, daiAvailable, vaultType } = vault;
  // const gem = collateralAmount?.symbol;

  console.log('debtValue', debtValue);

  // debtValue = formatValue(debtValue, 2);
  // console.log('debtValue After', debtValue);
  // daiAvailable = formatValue(daiAvailable, 2);

  //todo add dust
  const dust = 0;
  const dustLimit = dust || 0;
  const amountToGenerate = amount || 0;

  const cdpBelowDustLimit = debtValue.plus(amountToGenerate).lt(dustLimit);
  const cdpUnderCollateralized = daiAvailable.lt(amount);
  const failureMessage = cdpUnderCollateralized
    ? lang.action_sidebar.cdp_below_threshold
    : cdpBelowDustLimit
    ? lang.formatString(lang.cdp_create.below_dust_limit, dustLimit)
    : null;

  // verify we're doing the same as that calc cdp params function

  const generate = () => {
    newTxListener(
      maker.service('mcd:cdpManager').draw(cdpId, vaultType, MDAI(amount)),
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
          disabled={!amount || failureMessage} //this had amountErrors
          onClick={() => {
            // trackBtnClick('Confirm', { amount });
            generate();
          }}
        >
          {lang.actions.generate}
        </Button>
        <Button
          variant="secondary-outline"
          onClick={() => {
            // trackBtnClick('Cancel');
            reset();
          }}
        >
          {lang.cancel}
        </Button>
      </Grid>
      <InfoContainer>
        <Info
          title={lang.action_sidebar.maximum_available_to_generate}
          body={`${safeToFixed(daiAvailable.toNumber(), 7)} DAI`}
        />
        {/* <Info
          title={lang.action_sidebar.new_liquidation_price}
          body={cdp.liquidationPrice({ dart: amountToGenerate }).toString()}
        /> */}
        <Info
          title={lang.action_sidebar.new_collateralization_ratio}
          body={
            <Text color={cdpUnderCollateralized ? 'orange.600' : null}>
              {/* {formatCollateralizationRatio(
                cdp
                  .collateralizationRatio({ dart: amountToGenerate })
                  .times(100)
                  .toNumber()
              )} */}
            </Text>
          }
        />
      </InfoContainer>
    </Grid>
  );
};
export default Generate;
