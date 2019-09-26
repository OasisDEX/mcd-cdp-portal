import React, { useCallback, useMemo, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import {
  Box,
  Flex,
  Grid,
  Card,
  CardBody,
  Text,
  Table,
  Input,
  Button
} from '@makerdao/ui-components-core';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import PageContentLayout from 'layouts/PageContentLayout';
import LoadingLayout from 'layouts/LoadingLayout';

import { getSavingsBalance } from 'reducers/accounts';

import CardTabs from 'components/CardTabs';
import SetMax from 'components/SetMax';
import AllowanceToggle from 'components/AllowanceToggle';
import AccountSelection from 'components/AccountSelection';

import useMaker from 'hooks/useMaker';
import useWalletBalances from 'hooks/useWalletBalances';
import useValidatedInput from 'hooks/useValidatedInput';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useActionState from 'hooks/useActionState';
import useStore from 'hooks/useStore';
import useLanguage from 'hooks/useLanguage';

import { ReactComponent as DaiLogo } from 'images/dai.svg';
import useModal from '../hooks/useModal';
import useProxy from '../hooks/useProxy';

function Save() {
  const { lang } = useLanguage();
  const balances = useWalletBalances();
  const { maker, account } = useMaker();
  const [{ accounts, savings }] = useStore();
  const {
    hasAllowance,
    setAllowance,
    allowanceLoading,
    startedWithoutAllowance
  } = useTokenAllowance('MDAI');

  const { hasProxy, proxyLoading } = useProxy();
  const balance = useMemo(() => {
    return account
      ? getSavingsBalance(account.address, { accounts, savings })
      : 0;
  }, [account, accounts, savings]);

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
      maxFloat: balances.MDAI && balances.MDAI.toNumber()
    },
    {
      maxFloat: () =>
        lang.formatString(lang.action_sidebar.insufficient_balance, 'DAI')
    }
  );
  const [
    withdrawAmount,
    setWithdrawAmount,
    onWithdrawAmountChange,
    withdrawAmountErrors
  ] = useValidatedInput('', {
    isFloat: true,
    minFloat: 0.0,
    maxFloat: balance
  });

  const onStartDeposit = useCallback(() => {
    return maker.service('mcd:savings').join(MDAI(depositAmount));
  }, [maker, depositAmount]);

  const onStartWithdraw = useCallback(() => {
    if (new BigNumber(withdrawAmount).eq(balance)) {
      return maker.service('mcd:savings').exitAll();
    } else {
      return maker.service('mcd:savings').exit(MDAI(withdrawAmount));
    }
  }, [balance, maker, withdrawAmount]);

  const [
    onDeposit,
    depositLoading,
    depositSuccess,
    depositError
  ] = useActionState(onStartDeposit);
  const [
    onWithdraw,
    withdrawLoading,
    withdrawSuccess,
    withdrawError
  ] = useActionState(onStartWithdraw);

  useEffect(() => {
    if (depositSuccess) setDepositAmount('', { validate: false });
  }, [depositSuccess, setDepositAmount]);

  useEffect(() => {
    if (withdrawSuccess) setWithdrawAmount('', { validate: false });
  }, [setWithdrawAmount, withdrawSuccess]);

  useEffect(() => {
    if (!balances.MDAI) return;
    if (depositAmount !== '')
      setDepositAmount(depositAmount, { validate: true });
  }, [balances.MDAI, depositAmount, setDepositAmount]);

  useEffect(() => {
    if (!balance) return;
    if (withdrawAmount !== '')
      setWithdrawAmount(withdrawAmount, { validate: true });
  }, [balance, setWithdrawAmount, withdrawAmount]);

  const setDepositMax = useCallback(() => {
    if (balances.MDAI) {
      setDepositAmount(balances.MDAI.toNumber().toString());
    } else {
      setDepositAmount('0');
    }
  }, [balances.MDAI, setDepositAmount]);

  const setWithdrawMax = useCallback(() => {
    setWithdrawAmount(balance.toString());
  }, [balance, setWithdrawAmount]);

  const [showOnboarding, setShowOnboarding] = useState(true);

  const hideOnboarding = useCallback(() => {
    setShowOnboarding(false);
  }, [setShowOnboarding]);

  const { show } = useModal();

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
          <Text.p t="h4" mb="s">
            {lang.save.get_started_title}
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
            {lang.save.get_started}
          </Button>{' '}
        </Flex>
      ) : (
        <>
          <Text.h2 pr="m" mb="m" color="darkPurple">
            Balance
          </Text.h2>
          <Grid gridRowGap={{ s: 'm', m: 'l' }}>
            <Grid
              gridTemplateColumns={{ s: '1fr', m: 'auto auto 1fr' }}
              gridColumnGap="m"
              gridRowGap="s"
            >
              <Card>
                <CardBody px="l" py="m">
                  <Text.p t="h2">
                    {balance.toFixed(4)}{' '}
                    <Text t="h5">
                      <DaiLogo /> DAI
                    </Text>
                  </Text.p>
                  <Text.p t="h5" mt="s" color="steel">
                    {balance.toFixed(4)} USD
                  </Text.p>
                </CardBody>
                <CardBody px="l">
                  <Table width="100%">
                    <Table.tbody>
                      <Table.tr>
                        <Table.td>
                          <Text t="body">{lang.save.dai_savings_rate}</Text>
                        </Table.td>
                        <Table.td textAlign="right">
                          <Text t="body">
                            {savings && savings.yearlyRate
                              ? `${savings.yearlyRate.toFixed(2)}%`
                              : '--'}
                          </Text>
                        </Table.td>
                      </Table.tr>
                    </Table.tbody>
                  </Table>
                </CardBody>
              </Card>

              <CardTabs headers={[lang.actions.deposit, lang.actions.withdraw]}>
                <Grid px="l" py="m" gridRowGap="m">
                  <Text.p t="body">{lang.save.description}</Text.p>

                  <div>
                    <Text.p t="subheading" mb="s">
                      {lang.save.deposit_amount}
                    </Text.p>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0 DAI"
                      value={depositAmount}
                      onChange={onDepositAmountChange}
                      error={depositAmountErrors}
                      failureMessage={depositAmountErrors}
                      after={<SetMax onClick={setDepositMax} />}
                    />

                    {(startedWithoutAllowance || !hasAllowance) && (
                      <AllowanceToggle
                        mt="s"
                        tokenDisplayName="DAI"
                        onToggle={setAllowance}
                        isLoading={allowanceLoading}
                        isComplete={hasAllowance}
                        disabled={hasAllowance}
                      />
                    )}
                  </div>

                  <Box justifySelf="center">
                    <Button
                      disabled={
                        !hasAllowance ||
                        depositAmount === '' ||
                        depositAmountErrors ||
                        depositLoading
                      }
                      loading={depositLoading}
                      onClick={onDeposit}
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

                  <div>
                    <Text.p t="subheading" mb="s">
                      {lang.save.withdraw_amount}
                    </Text.p>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0 DAI"
                      value={withdrawAmount}
                      onChange={onWithdrawAmountChange}
                      error={withdrawAmountErrors}
                      failureMessage={withdrawAmountErrors}
                      after={<SetMax onClick={setWithdrawMax} />}
                    />

                    {(startedWithoutAllowance || !hasAllowance) && (
                      <AllowanceToggle
                        mt="s"
                        tokenDisplayName="DAI"
                        onToggle={setAllowance}
                        isLoading={allowanceLoading}
                        isComplete={hasAllowance}
                        disabled={hasAllowance}
                      />
                    )}
                  </div>

                  <Box justifySelf="center">
                    <Button
                      disabled={
                        !hasAllowance ||
                        withdrawAmount === '' ||
                        withdrawAmountErrors ||
                        withdrawLoading
                      }
                      loading={withdrawLoading}
                      onClick={onWithdraw}
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
        </>
      )}
    </PageContentLayout>
  );
}

export default Save;
