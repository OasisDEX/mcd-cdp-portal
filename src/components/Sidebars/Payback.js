import React from 'react';
import { DAI } from '@makerdao/dai-plugin-mcd';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import debug from 'debug';

import { formatCollateralizationRatio } from 'utils/ui';

import useMaker from 'hooks/useMaker';
import useProxy from 'hooks/useProxy';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useWalletBalances from 'hooks/useWalletBalances';
import useValidatedInput from 'hooks/useValidatedInput';
import useLanguage from 'hooks/useLanguage';
import useAnalytics from 'hooks/useAnalytics';
import { formatter } from '../../utils/ui';
import { subtract, greaterThan, equalTo, minimum } from '../../utils/bignumber';

import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import ProxyAllowanceToggle from 'components/ProxyAllowanceToggle';
import SetMax from 'components/SetMax';
import { BigNumber } from 'bignumber.js';
import { decimalRules } from '../../styles/constants';
const { long, medium } = decimalRules;

const log = debug('maker:Sidebars/Payback');

const Payback = ({ vault, reset }) => {
  const { trackBtnClick } = useAnalytics('Payback', 'Sidebar');
  const { lang } = useLanguage();
  const { maker } = useMaker();
  const balances = useWalletBalances();
  const daiBalance = balances.DAI;

  const { hasAllowance, hasSufficientAllowance } = useTokenAllowance('DAI');
  const { hasProxy } = useProxy();

  let { debtValue, debtFloor, collateralAmount } = vault;
  debtValue = debtValue.toBigNumber().decimalPlaces(18);
  const symbol = collateralAmount?.symbol;

  // Amount being repaid can't result in a remaining debt lower than the dust
  // minimum unless the full amount is being repaid
  const dustLimitValidation = input =>
    greaterThan(debtFloor, subtract(debtValue, input)) &&
    equalTo(input, debtValue) !== true;

  const [amount, setAmount, onAmountChange, amountErrors] = useValidatedInput(
    '',
    {
      maxFloat: Math.min(daiBalance, debtValue),
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
          subtract(debtValue, debtFloor)
        ),
      allowanceInvalid: () =>
        lang.formatString(lang.action_sidebar.invalid_allowance, 'DAI')
    }
  );

  const amountToPayback = amount || 0;

  // Don't enter more than the user's balance if there isn't enough to cover the debt.
  const maxPaybackAmount =
    debtValue && daiBalance && minimum(debtValue, daiBalance);
  const setMax = () => setAmount(maxPaybackAmount.toString());

  const payback = async () => {
    const cdpManager = maker.service('mcd:cdpManager');
    const owner = await cdpManager.getOwner(vault.id);
    if (!owner) {
      log(`Unable to find owner of CDP #${vault.id}`);
      return;
    }
    const wipeAll = debtValue.toString() === amount;
    if (wipeAll) log('Calling wipeAll()');
    else log('Calling wipe()');
    wipeAll
      ? cdpManager.wipeAll(vault.id, owner)
      : cdpManager.wipe(vault.id, DAI(amount), owner);
    reset();
  };

  const valid = amount && !amountErrors && hasProxy && hasAllowance;
  const undercollateralized = debtValue.minus(amountToPayback).lt(0);

  const liquidationPrice = undercollateralized
    ? BigNumber(0)
    : vault.calculateLiquidationPrice({
        debtValue: DAI(debtValue.minus(amountToPayback))
      });
  const collateralizationRatio = undercollateralized
    ? Infinity
    : vault.calculateCollateralizationRatio({
        debtValue: DAI(debtValue.minus(amountToPayback))
      });
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
          after={
            <SetMax
              onClick={() => {
                setMax();
                trackBtnClick('SetMax', {
                  maxAmount: maxPaybackAmount.toString(),
                  setMax: true
                });
              }}
            />
          }
        />
      </Grid>
      <ProxyAllowanceToggle token="DAI" trackBtnClick={trackBtnClick} />
      <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
        <Button
          disabled={!valid}
          onClick={() => {
            trackBtnClick('Confirm', {
              amount,
              fathom: { id: `${symbol}VaultPayback`, amount }
            });
            payback();
          }}
        >
          {lang.actions.pay_back}
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
          title={lang.action_sidebar.dai_balance}
          body={`${daiBalance &&
            formatter(daiBalance, { precision: long })} DAI`}
        />
        <Info
          title={lang.action_sidebar.dai_debt}
          body={`${formatter(debtValue, { precision: long })} DAI`}
        />
        <Info
          title={lang.action_sidebar.new_liquidation_price}
          body={`${formatter(liquidationPrice, {
            infinity: BigNumber(0).toFixed(medium)
          })} USD/${symbol}`}
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
