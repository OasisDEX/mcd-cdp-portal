import React, { useCallback, useMemo, useEffect } from 'react';
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
import lang from 'languages';
import PageContentLayout from 'layouts/PageContentLayout';

import { getSavingsBalance } from 'reducers/accounts';

import CardTabs from 'components/CardTabs';
import SetMax from 'components/SetMax';
import AllowanceToggle from 'components/AllowanceToggle';

import useMaker from 'hooks/useMaker';
import useWalletBalances from 'hooks/useWalletBalances';
import useValidatedInput from 'hooks/useValidatedInput';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useActionState from 'hooks/useActionState';
import useStore from 'hooks/useStore';

import { ReactComponent as DaiLogo } from 'images/dai.svg';

function Save() {
  const balances = useWalletBalances();
  const { maker, account } = useMaker();
  const [{ accounts, savings }] = useStore();
  const {
    hasAllowance,
    setAllowance,
    allowanceLoading,
    startedWithoutAllowance
  } = useTokenAllowance('MDAI');

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
  }, [maker, withdrawAmount]);

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
  }, [depositSuccess]);

  useEffect(() => {
    if (withdrawSuccess) setWithdrawAmount('', { validate: false });
  }, [withdrawSuccess]);

  useEffect(() => {
    if (!balances.MDAI) return;
    if (depositAmount !== '')
      setDepositAmount(depositAmount, { validate: true });
  }, [balances.MDAI]);

  useEffect(() => {
    if (!balance) return;
    if (withdrawAmount !== '')
      setWithdrawAmount(withdrawAmount, { validate: true });
  }, [balance]);

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

  return (
    <PageContentLayout>
      <Flex justifyContent="center" mt="xl">
        <Box px="m">
          <Text.p t="h4" mb="s">
            Balance
          </Text.p>
          <Grid
            gridTemplateColumns={{ m: '1fr', l: '437px 352px' }}
            gridColumnGap="l"
            gridRowGap="m"
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
        </Box>
      </Flex>
    </PageContentLayout>
  );
}

export default Save;
