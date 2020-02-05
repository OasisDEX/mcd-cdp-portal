import React from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import BigNumber from 'bignumber.js';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useLanguage from 'hooks/useLanguage';
import { formatCollateralizationRatio, formatter } from '../../utils/ui';
import useMaker from '../../hooks/useMaker';
import useAnalytics from 'hooks/useAnalytics';
import RatioDisplay, { RatioDisplayTypes } from 'components/RatioDisplay';
import useValidatedInput from 'hooks/useValidatedInput';
import { add, greaterThan } from '../../utils/bignumber';

const Generate = ({ vault, reset }) => {
  const { trackBtnClick } = useAnalytics('Generate', 'Sidebar');
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();

  let {
    debtValue,
    daiAvailable,
    vaultType,
    debtFloor,
    collateralAmount,
    liquidationRatioSimple: liquidationRatio
  } = vault;
  BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
  debtValue = debtValue.toBigNumber().decimalPlaces(18);
  const symbol = collateralAmount?.symbol;

  const dustLimitValidation = value =>
    greaterThan(debtFloor, add(value, debtValue));

  const [amount, , onAmountChange, failureMessage] = useValidatedInput(
    '',
    {
      maxFloat: formatter(daiAvailable),
      minFloat: 0,
      isFloat: true,
      custom: {
        dustLimit: dustLimitValidation
      }
    },
    {
      maxFloat: () => lang.action_sidebar.cdp_below_threshold,
      dustLimit: () =>
        lang.formatString(
          lang.cdp_create.below_dust_limit,
          formatter(debtFloor)
        )
    }
  );

  const amountToGenerate = amount || 0;
  const undercollateralized = daiAvailable.lt(amount);

  const generate = () => {
    newTxListener(
      maker.service('mcd:cdpManager').draw(vault.id, vaultType, MDAI(amount)),
      lang.transactions.generate_dai
    );
    reset();
  };

  const liquidationPrice = vault.calculateLiquidationPrice({
    debtValue: vault?.debtValue.plus(amountToGenerate)
  });

  const collateralizationRatio = vault.calculateCollateralizationRatio({
    debtValue: vault?.debtValue.plus(amountToGenerate)
  });

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
          onChange={onAmountChange}
          placeholder="0.00 DAI"
          failureMessage={failureMessage}
        />
        <RatioDisplay
          type={RatioDisplayTypes.CARD}
          ratio={collateralizationRatio}
          ilkLiqRatio={formatter(liquidationRatio, { percentage: true })}
          text={lang.action_sidebar.generate_warning}
          onlyWarnings={true}
          show={amount !== '' && amount > 0 && !undercollateralized}
          textAlign="center"
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
          body={`${formatter(liquidationPrice)} USD/${symbol}`}
        />
        <Info
          title={lang.action_sidebar.new_collateralization_ratio}
          body={
            <RatioDisplay
              type={RatioDisplayTypes.TEXT}
              ratio={collateralizationRatio}
              ilkLiqRatio={formatter(liquidationRatio, { percentage: true })}
              text={formatCollateralizationRatio(collateralizationRatio)}
              show={amount !== '' && amount > 0 && !undercollateralized}
            />
          }
        />
      </InfoContainer>
    </Grid>
  );
};
export default Generate;
