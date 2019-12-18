import React from 'react';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import round from 'lodash/round';
import debug from 'debug';

import { formatCollateralizationRatio, formatLiquidationPrice } from 'utils/ui';
import { calcCDPParams } from 'utils/cdp';
import { minimum } from 'utils/bignumber';

import useMaker from 'hooks/useMaker';
import useProxy from 'hooks/useProxy';
import useStore from 'hooks/useStore';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useWalletBalances from 'hooks/useWalletBalances';
import useValidatedInput from 'hooks/useValidatedInput';
import useLanguage from 'hooks/useLanguage';
import { safeToFixed } from '../../utils/ui';
import { subtract, greaterThan, equalTo } from '../../utils/bignumber';

import { getCdp, getDebtAmount, getCollateralAmount } from 'reducers/cdps';

import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import ProxyAllowanceToggle from 'components/ProxyAllowanceToggle';
import SetMax from 'components/SetMax';

const log = debug('maker:Sidebars/Payback');

const Payback = ({ cdpId, reset }) => {
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();
  const balances = useWalletBalances();
  const daiBalance = balances.MDAI;

  const { hasAllowance, hasSufficientAllowance } = useTokenAllowance('MDAI');
  const { hasProxy } = useProxy();

  const [storeState] = useStore();
  const cdp = getCdp(cdpId, storeState);
  const collateralAmount = getCollateralAmount(cdp, true, 9);
  const debtAmount = getDebtAmount(cdp, true, 18);

  const dustLimit = cdp.dust ? cdp.dust : 0;
  const maxAmount = debtAmount && daiBalance && minimum(debtAmount, daiBalance);

  // Amount being repaid can't result in a remaining debt lower than the dust
  // minimum unless the full amount is being repaid
  const dustLimitValidation = input =>
    greaterThan(dustLimit, subtract(debtAmount, input)) &&
    equalTo(input, debtAmount) !== true;

  const [amount, setAmount, onAmountChange, amountErrors] = useValidatedInput(
    '',
    {
      maxFloat: Math.min(daiBalance, debtAmount),
      minFloat: 0,
      isFloat: true,
      custom: {
        dustLimit: dustLimitValidation,
        allowanceInvalid: value => !hasSufficientAllowance(value)
      }
    },
    {
      maxFloat: amount => {
        return greaterThan(amount, daiBalance)
          ? lang.formatString(lang.action_sidebar.insufficient_balance, 'DAI')
          : lang.action_sidebar.cannot_payback_more_than_owed;
      },
      dustLimit: () =>
        lang.formatString(
          lang.cdp_create.dust_max_payback,
          subtract(debtAmount, dustLimit)
        ),
      allowanceInvalid: () =>
        lang.formatString(lang.action_sidebar.invalid_allowance, 'DAI')
    }
  );

  const amountToPayback = amount || 0;
  const { liquidationPrice, collateralizationRatio } = calcCDPParams({
    ilkData: cdp,
    gemsToLock: collateralAmount,
    daiToDraw: Math.max(subtract(debtAmount, amountToPayback), 0)
  });
  const setMax = () => setAmount(maxAmount);

  const payback = async () => {
    const cdpManager = maker.service('mcd:cdpManager');
    const owner = await cdpManager.getOwner(cdpId);
    if (!owner) {
      log(`Unable to find owner of CDP #${cdpId}`);
      return;
    }
    const wipeAll = debtAmount.toString() === amount;
    if (wipeAll) log('Calling wipeAll()');
    else log('Calling wipe()');
    newTxListener(
      wipeAll
        ? cdpManager.wipeAll(cdpId, owner)
        : cdpManager.wipe(cdpId, MDAI(amount), owner),
      lang.transactions.pay_back_dai
    );
    reset();
  };

  const valid = amount && !amountErrors && hasProxy && hasAllowance;
  return (
    <Grid gridRowGap="m">
      <Grid gridRowGap="s">
        <Text.h4 color="darkLavender">
          {lang.action_sidebar.payback_title}
        </Text.h4>
        <Text.p t="body">{lang.action_sidebar.payback_description}</Text.p>
        <Input
          type="number"
          value={amount}
          min="0"
          onChange={onAmountChange}
          placeholder="0.00 DAI"
          failureMessage={amountErrors}
          data-testid="payback-input"
          after={<SetMax onClick={setMax} />}
        />
      </Grid>
      <ProxyAllowanceToggle token="MDAI" />
      <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
        <Button disabled={!valid} onClick={payback}>
          {lang.actions.pay_back}
        </Button>
        <Button variant="secondary-outline" onClick={reset}>
          {lang.cancel}
        </Button>
      </Grid>
      <InfoContainer>
        <Info
          title={lang.action_sidebar.dai_balance}
          body={`${daiBalance && safeToFixed(daiBalance, 7)} DAI`}
        />
        <Info
          title={lang.action_sidebar.dai_debt}
          body={`${round(debtAmount, 6)} DAI`}
        />
        <Info
          title={lang.action_sidebar.new_liquidation_price}
          body={formatLiquidationPrice(liquidationPrice, cdp.currency.symbol)}
        />
        <Info
          title={lang.action_sidebar.new_collateralization_ratio}
          body={formatCollateralizationRatio(collateralizationRatio)}
        />
      </InfoContainer>
    </Grid>
  );
};
export default Payback;
