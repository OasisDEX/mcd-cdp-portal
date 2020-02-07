import React, { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import {
  Box,
  Flex,
  Grid,
  Text,
  Input,
  Button
} from '@makerdao/ui-components-core';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import PageContentLayout from 'layouts/PageContentLayout';
import LoadingLayout from 'layouts/LoadingLayout';

import CardTabs from 'components/CardTabs';
import SetMax from 'components/SetMax';
import History from 'components/CDPDisplay/History';
import AccountSelection from 'components/AccountSelection';
import ProxyAllowanceToggle from 'components/ProxyAllowanceToggle';
import DSRInfo from 'components/DSRInfo';
import useMaker from 'hooks/useMaker';
import useWalletBalances from 'hooks/useWalletBalances';
import useValidatedInput from 'hooks/useValidatedInput';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useActionState from 'hooks/useActionState';
import useStore from 'hooks/useStore';
import useLanguage from 'hooks/useLanguage';
import useDsrEventHistory from 'hooks/useDsrEventHistory';
import useModal from 'hooks/useModal';
import useProxy from 'hooks/useProxy';
import useAnalytics from 'hooks/useAnalytics';
import { FeatureFlags } from 'utils/constants';
import theme from '../styles/theme';

function Save() {
  const { lang } = useLanguage();
  const balances = useWalletBalances();
  const { maker, account, newTxListener, network } = useMaker();
  const [{ savings }] = useStore();

  const { hasAllowance, hasSufficientAllowance } = useTokenAllowance('MDAI');

  const [withdrawMaxFlag, setWithdrawMaxFlag] = useState(false);
  const { proxyAddress, hasProxy, proxyLoading } = useProxy();

  const { trackBtnClick: trackDeposit } = useAnalytics('Deposit');
  const { trackBtnClick: trackWithdraw } = useAnalytics('Withdraw');

  const trackTab = tabName => {
    if (tabName === 'Deposit') trackDeposit('SelectDeposit');
    else if (tabName === 'Withdraw') trackWithdraw('SelectWithdraw');
  };

  const balance = balances.DSR;

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
      maxFloat: balances.MDAI && balances.MDAI.toNumber(),
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
      maxFloat: balance
    },
    {
      maxFloat: () =>
        lang.formatString(lang.action_sidebar.insufficient_balance, 'DAI')
    }
  );

  const onStartDeposit = useCallback(() => {
    newTxListener(
      maker.service('mcd:savings').join(MDAI(depositAmount)),
      lang.verbs.depositing
    );
  }, [maker, depositAmount, newTxListener, lang]);

  const onStartWithdraw = useCallback(() => {
    let txObject;
    if (withdrawMaxFlag || new BigNumber(withdrawAmount).eq(balance)) {
      txObject = maker.service('mcd:savings').exitAll();
    } else {
      txObject = maker.service('mcd:savings').exit(MDAI(withdrawAmount));
    }
    newTxListener(txObject, lang.verbs.withdrawing);
  }, [balance, maker, withdrawAmount, withdrawMaxFlag, newTxListener, lang]);

  const [
    onDeposit,
    depositLoading,
    depositSuccess,
    depositError,
    depositReset
  ] = useActionState(onStartDeposit);

  const [
    onWithdraw,
    withdrawLoading,
    withdrawSuccess,
    withdrawError,
    withdrawReset
  ] = useActionState(onStartWithdraw);

  const { events, isLoading } = FeatureFlags.FF_DSR_HISTORY
    ? useDsrEventHistory(proxyAddress) // eslint-disable-line react-hooks/rules-of-hooks
    : {};

  useEffect(() => {
    if (!balances.MDAI) return;
    if (depositSuccess) {
      setDepositAmount('', { validate: false });
      depositReset();
    }
  }, [balances.MDAI, depositReset, depositSuccess, setDepositAmount]);

  useEffect(() => {
    if (!balance) return;
    if (withdrawSuccess) {
      setWithdrawAmount('', { validate: false });
      withdrawReset();
    }
  }, [balance, withdrawReset, setWithdrawAmount, withdrawSuccess]);

  // https://stackoverflow.com/a/36028587 -> Prevents scientific notation
  const setDepositMax = useCallback(() => {
    if (balances.MDAI && !balances.MDAI.eq(0)) {
      setDepositAmount(balances.MDAI.toFixed(18).replace(/\.?0+$/, ''));
    } else {
      setDepositAmount('');
    }
  }, [balances.MDAI, setDepositAmount]);

  const setWithdrawMax = useCallback(() => {
    if (balance && !balance.eq(0)) {
      setWithdrawAmount(balance.toFixed(18).replace(/\.?0+$/, ''));
      setWithdrawMaxFlag(true);
    } else {
      setWithdrawAmount('');
    }
  }, [balance, setWithdrawAmount]);

  const [showOnboarding, setShowOnboarding] = useState(true);

  const hideOnboarding = useCallback(() => {
    setShowOnboarding(false);
  }, [setShowOnboarding]);

  const { show } = useModal();

  const emSize = parseInt(getComputedStyle(document.body).fontSize);
  const pxBreakpoint = parseInt(theme.breakpoints.l) * emSize;
  const isMobile = document.documentElement.clientWidth < pxBreakpoint;

  return (
    <PageContentLayout>
      {!account ? (
        <AccountSelection />
      ) : proxyLoading && !hasProxy ? (
        <LoadingLayout />
      ) : !hasProxy && showOnboarding ? (
        <Flex
          height="70vh"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Text.p t="h4" mb="26px">
            {lang.formatString(
              lang.save.get_started_title,
              `${savings?.yearlyRate.toFixed(2)}%`
            )}
          </Text.p>
          <Button
            p="s"
            css={{ cursor: 'pointer' }}
            onClick={() =>
              show({
                modalType: 'dsrdeposit',
                modalTemplate: 'fullscreen',
                modalProps: { hideOnboarding }
              })
            }
          >
            {lang.actions.get_started}
          </Button>
        </Flex>
      ) : (
        <>
          <Text.h2 pr="m" mb="m" color="darkPurple">
            {lang.save.title}
          </Text.h2>
          <Grid gridRowGap={{ s: 'm', m: 'l' }}>
            <Grid
              py="m"
              gridColumnGap="m"
              gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}
            >
              {account ? (
                <DSRInfo address={account.address} isMobile={isMobile} />
              ) : (
                <div />
              )}
              <Grid py="s" height="100%" flexDirection="column">
                <CardTabs
                  trackTab={trackTab}
                  headers={[lang.actions.deposit, lang.actions.withdraw]}
                >
                  <Grid px="l" py="m" gridRowGap="m">
                    <Text.p t="body">{lang.save.description}</Text.p>

                    <Text.p t="subheading" mb="s">
                      {lang.save.deposit_amount}
                    </Text.p>
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
                    />

                    <Box my="xs">
                      <ProxyAllowanceToggle
                        token="MDAI"
                        onlyShowAllowance={true}
                      />
                    </Box>

                    <Box justifySelf="center">
                      <Button
                        disabled={
                          !hasAllowance ||
                          depositAmount === '' ||
                          depositAmountErrors ||
                          depositLoading
                        }
                        loading={depositLoading}
                        onClick={() => {
                          trackDeposit('Deposit', { amount: depositAmount });
                          onDeposit();
                        }}
                        data-testid={'deposit-button'}
                      >
                        {lang.actions.deposit}
                      </Button>
                    </Box>
                    {depositError && (
                      <Text.p t="caption" color="orange.600" textAlign="center">
                        {depositError}
                      </Text.p>
                    )}
                  </Grid>
                  <Grid px="l" py="m" gridRowGap="m">
                    <Text.p t="body">{lang.save.description}</Text.p>

                    <Text.p t="subheading" mb="s">
                      {lang.save.withdraw_amount}
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
                      after={<SetMax onClick={setWithdrawMax} />}
                    />

                    <Box my="xs">
                      <ProxyAllowanceToggle
                        token="MDAI"
                        onlyShowAllowance={true}
                      />
                    </Box>

                    <Box justifySelf="center">
                      <Button
                        disabled={
                          !hasAllowance ||
                          withdrawAmount === '' ||
                          withdrawAmountErrors ||
                          withdrawLoading
                        }
                        loading={withdrawLoading}
                        onClick={() => {
                          trackWithdraw('Withdraw', { amount: withdrawAmount });
                          onWithdraw();
                        }}
                        data-testid={'withdraw-button'}
                      >
                        {lang.actions.withdraw}
                      </Button>
                    </Box>

                    {withdrawError && (
                      <Text.p t="caption" color="orange.600" textAlign="center">
                        {withdrawError}
                      </Text.p>
                    )}
                  </Grid>
                </CardTabs>
              </Grid>
            </Grid>
          </Grid>
          {FeatureFlags.FF_DSR_HISTORY && (
            <History
              title={lang.save.tx_history}
              rows={events}
              network={network}
              isLoading={isLoading}
              emptyTableMessage={lang.save.start_earning}
            />
          )}
        </>
      )}
    </PageContentLayout>
  );
}

export default Save;
