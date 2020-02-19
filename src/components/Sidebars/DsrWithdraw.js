import React, { useState, useCallback } from 'react';
import { Text, Input, Grid, Button } from '@makerdao/ui-components-core';
import Info from './shared/Info';
import InfoContainer from './shared/InfoContainer';
import useMaker from 'hooks/useMaker';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useWalletBalances from 'hooks/useWalletBalances';
import useValidatedInput from 'hooks/useValidatedInput';
import useLanguage from 'hooks/useLanguage';
import useAnalytics from 'hooks/useAnalytics';
import ProxyAllowanceToggle from 'components/ProxyAllowanceToggle';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import SetMax from 'components/SetMax';
import { BigNumber } from 'bignumber.js';
import { safeToFixed } from '../../utils/ui';

const Withdraw = ({ reset }) => {
  const { trackBtnClick } = useAnalytics('Withdraw', 'Sidebar');
  const { lang } = useLanguage();
  const { maker, newTxListener } = useMaker();

  const { symbol } = MDAI;
  const displaySymbol = 'DAI';

  const { MDAI: daiBalance, DSR: dsrBalance } = useWalletBalances();
  const { hasAllowance, hasSufficientAllowance } = useTokenAllowance(symbol);
  const [withdrawMaxFlag, setWithdrawMaxFlag] = useState(false);

  const [
    withdrawAmount,
    setWithdrawAmount,
    onWithdrawAmountChange,
    withdrawAmountErrors
  ] = useValidatedInput(
    '',
    {
      isFloat: true,
      minFloat: 0.0,
      maxFloat: dsrBalance && dsrBalance.toNumber(),
      custom: {
        allowanceInvalid: value => !hasSufficientAllowance(value)
      }
    },
    {
      maxFloat: () =>
        lang.formatString(
          lang.action_sidebar.insufficient_balance,
          displaySymbol
        ),
      allowanceInvalid: () =>
        lang.formatString(lang.action_sidebar.invalid_allowance, displaySymbol)
    }
  );

  const setWithdrawMax = useCallback(() => {
    if (dsrBalance && !dsrBalance.eq(0)) {
      setWithdrawAmount(dsrBalance.toFixed(18).replace(/\.?0+$/, ''));
      setWithdrawMaxFlag(true);
    } else {
      setWithdrawAmount('');
    }
  }, [dsrBalance, setWithdrawAmount]);

  const withdraw = () => {
    let txObject;
    if (withdrawMaxFlag || new BigNumber(withdrawAmount).eq(dsrBalance)) {
      txObject = maker.service('mcd:savings').exitAll();
    } else {
      txObject = maker.service('mcd:savings').exit(MDAI(withdrawAmount));
    }
    newTxListener(
      txObject,
      lang.formatString(lang.transactions.withdrawing_gem, displaySymbol)
    );
    reset();
  };

  const valid = withdrawAmount && !withdrawAmountErrors && hasAllowance;

  return (
    <Grid gridRowGap="m">
      <Grid gridRowGap="s">
        <Text.h4 color="darkLavender">
          {lang.formatString(lang.action_sidebar.withdraw_title, displaySymbol)}
        </Text.h4>
        <Text.p t="body">
          {lang.formatString(
            lang.action_sidebar.withdraw_description,
            displaySymbol
          )}
        </Text.p>
        <Input
          disabled={!hasAllowance}
          type="number"
          min="0"
          placeholder="0 DAI"
          value={withdrawAmount}
          onChange={e => {
            if (withdrawMaxFlag) setWithdrawMaxFlag(false);
            onWithdrawAmountChange(e);
          }}
          error={withdrawAmountErrors}
          failureMessage={withdrawAmountErrors}
          after={
            <SetMax
              onClick={() => {
                setWithdrawMax();
                trackBtnClick('SetMax', {
                  amount: withdrawAmount,
                  setMax: true
                });
              }}
            />
          }
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
            trackBtnClick('Confirm', { amount: withdrawAmount });
            withdraw();
          }}
          data-testid={'withdraw-button'}
        >
          {lang.actions.withdraw}
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
export default Withdraw;
