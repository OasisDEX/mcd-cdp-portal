import React, { useState, useCallback } from 'react';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useMaker from 'hooks/useMaker';
// import useProxy from 'hooks/useProxy';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useWalletBalances from 'hooks/useWalletBalances';
import useValidatedInput from 'hooks/useValidatedInput';
import useLanguage from 'hooks/useLanguage';
import useAnalytics from 'hooks/useAnalytics';
import useActionState from 'hooks/useActionState';
import ProxyAllowanceToggle from 'components/ProxyAllowanceToggle';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import SetMax from 'components/SetMax';
import { safeToFixed } from '../../utils/ui';

const Deposit = ({ reset }) => {
  const { trackBtnClick } = useAnalytics('Deposit');
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();

  const { symbol } = MDAI;
  const displaySymbol = 'DAI';

  const { MDAI: daiBalance, DSR: dsrBalance } = useWalletBalances();
  const { hasAllowance, hasSufficientAllowance } = useTokenAllowance(symbol);
  // const [depositMaxFlag, setDepositMaxFlag] = useState(false);
  // const { hasProxy } = useProxy();

  const [
    depositAmount,
    setDepositAmount,
    onDepositAmountChange,
    depositAmountErrors
  ] = useValidatedInput(
    '',
    {
      isFloat: true,
      minFloat: 0.0,
      maxFloat: daiBalance && daiBalance.toNumber(),
      custom: {
        allowanceInvalid: value => !hasSufficientAllowance(value)
      }
    },
    {
      maxFloat: () =>
        lang.formatString(lang.action_sidebar.insufficient_balance, 'DAI'),
      allowanceInvalid: () =>
        lang.formatString(lang.action_sidebar.invalid_allowance, 'DAI')
    }
  );
  const valid =
    depositAmount && !depositAmountErrors && hasAllowance && !depositLoading;

  const setDepositMax = useCallback(() => {
    if (daiBalance && !daiBalance.eq(0)) {
      //todo can we just do daiBalance.toString()
      console.log('daiBalance.toString() (SETMAX)', daiBalance.toString());
      setDepositAmount(daiBalance.toFixed(18).replace(/\.?0+$/, ''));
    } else {
      setDepositAmount('');
    }
  }, [daiBalance, setDepositAmount]);

  const onStartDeposit = useCallback(() => {
    newTxListener(
      maker.service('mcd:savings').join(MDAI(depositAmount)),
      lang.formatString(lang.transactions.depositing_gem, displaySymbol)
    );
  }, [maker, depositAmount, newTxListener, lang]);

  //TODO do I need the success state to clear depositAmount
  //or will it be done auto now that we're using sidebar provider?
  const [
    onDeposit,
    depositLoading,
    depositSuccess,
    depositError,
    depositReset
  ] = useActionState(onStartDeposit);

  return (
    <Grid gridRowGap="m">
      <Grid gridRowGap="s">
        <Text color="darkLavender" t="h4">
          {lang.formatString(lang.action_sidebar.deposit_title, displaySymbol)}
        </Text>
        <p>
          <Text t="body">
            {lang.formatString(
              lang.action_sidebar.deposit_description,
              displaySymbol
            )}
          </Text>
        </p>
        <Input
          disabled={!hasAllowance}
          type="number"
          min="0"
          placeholder="0 DAI"
          value={depositAmount}
          onChange={onDepositAmountChange}
          error={depositAmountErrors}
          failureMessage={depositAmountErrors}
          after={<SetMax onClick={setDepositMax} />}
          data-testid="dsrdeposit-input"
        />
      </Grid>
      <ProxyAllowanceToggle
        token="MDAI"
        onlyShowAllowance={true}
        trackBtnClick={trackBtnClick}
      />
      <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s">
        <Button
          disabled={!valid}
          onClick={() => {
            trackBtnClick('Deposit', { amount: depositAmount });
            // onStartDeposit();
            onDeposit();
            //todo use depositReset actionState here?
            reset();
          }}
          data-testid={'deposit-button'}
        >
          {lang.actions.deposit}
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
        {/* TODO: not sure if this is necessary. Conflicts with useValidatedInput? */}
        {depositError && (
          <Text.p t="caption" color="orange.600" textAlign="center">
            {depositError}
          </Text.p>
        )}
      </Grid>
      <InfoContainer>
        <Info
          title={lang.action_sidebar.dai_balance}
          body={`${safeToFixed(daiBalance, 7)} ${displaySymbol}`}
        />
        <Info
          title={lang.action_sidebar.locked_dsr}
          body={`${safeToFixed(dsrBalance.toNumber(), 7)} ${displaySymbol}`}
        />
      </InfoContainer>
    </Grid>
  );
};
export default Deposit;
