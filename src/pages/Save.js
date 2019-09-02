import React, { useState, useCallback, useEffect } from 'react';
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

import CardTabs from 'components/CardTabs';
import AccountBox from 'components/AccountBox';
import SetMax from 'components/SetMax';
import AllowanceToggle from 'components/AllowanceToggle';

import useMaker from 'hooks/useMaker';
import useWalletBalances from 'hooks/useWalletBalances';
import useValidatedInput from 'hooks/useValidatedInput';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useActionState from 'hooks/useActionState';
import { ReactComponent as DaiLogo } from 'images/dai.svg';

function Save() {
  const balances = useWalletBalances();
  const { maker, account } = useMaker();
  const [balance, setBalance] = useState(0);
  const [yearlyRate, setYearlyRate] = useState(undefined);
  const [
    hasAllowance,
    setAllowance,
    startedWithoutAllowance
  ] = useTokenAllowance('MDAI');

  const [onSetAllowance, allowanceLoading] = useActionState(setAllowance);

  const [
    depositAmount,
    setDepositAmount,
    onDepositAmountChange,
    depositAmountErrors
  ] = useValidatedInput('', {
    isFloat: true,
    minFloat: 0.0,
    maxFloat: balances.MDAI && balances.MDAI.toNumber()
  });
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

  const [onDeposit, depositLoading, depositError] = useActionState(
    onStartDeposit
  );
  const [onWithdraw, withdrawLoading, withdrawError] = useActionState(
    onStartWithdraw
  );

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

  useEffect(() => {
    (async () => {
      if (!account) return setBalance(0);
      let proxyAddress;
      try {
        proxyAddress = await maker.currentProxy();
      } catch (err) {
        return setBalance(0);
      }

      const balance = await maker
        .service('mcd:savings')
        .balanceOf(proxyAddress);
      setBalance(balance.toNumber());
    })();
  }, [account]);

  useEffect(() => {
    maker
      .service('mcd:savings')
      .getYearlyRate()
      .then(rate => {
        setYearlyRate(rate);
      });
  }, []);

  return (
    <Flex justifyContent="center" mt="xl">
      <Box px="m">
        <Text.p t="h4" mb="s">
          Balance
        </Text.p>
        <Grid
          gridTemplateColumns={{ m: '1fr', l: '437px 352px 300px' }}
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
            <CardBody px="l" py="m">
              <Table width="100%">
                <Table.tbody>
                  <Table.tr>
                    <Table.td>
                      <Text t="body">Dai Savings rate</Text>
                    </Table.td>
                    <Table.td textAlign="right">
                      <Text t="body">
                        {yearlyRate ? `${yearlyRate.toFixed(2)}%` : '--'}
                      </Text>
                    </Table.td>
                  </Table.tr>
                  <Table.tr>
                    <Table.td>
                      <Text t="body">Locked Dai</Text>
                    </Table.td>
                    <Table.td textAlign="right">
                      <Text t="body">120,032.5001</Text>
                    </Table.td>
                  </Table.tr>
                  <Table.tr>
                    <Table.td>
                      <Text t="body">Free Dai</Text>
                    </Table.td>
                    <Table.td textAlign="right">
                      <Text t="body">10,000.0000 DAI</Text>
                    </Table.td>
                  </Table.tr>
                  <Table.tr>
                    <Table.td>
                      <Text t="body">Ratio</Text>
                    </Table.td>
                    <Table.td textAlign="right">
                      <Text t="body">87.21% locked</Text>
                    </Table.td>
                  </Table.tr>
                </Table.tbody>
              </Table>
            </CardBody>
          </Card>

          <CardTabs headers={['Deposit', 'Withdraw']}>
            <Grid px="l" py="m" gridRowGap="m">
              <Text.p t="body">
                Receive interest on your Dai. Withdraw or top-up at any time.
              </Text.p>

              <div>
                <Text.p t="subheading" mb="s">
                  Deposit amount
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

                {startedWithoutAllowance && (
                  <AllowanceToggle
                    mt="s"
                    tokenDisplayName="DAI"
                    onToggle={onSetAllowance}
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
                  Deposit
                </Button>
              </Box>
              {depositError && (
                <Text.p t="caption" color="orange.600" textAlign="center">
                  {depositError}
                </Text.p>
              )}
            </Grid>
            <Grid px="l" py="m" gridRowGap="m">
              <Text.p t="body">
                Receive interest on your Dai. Withdraw or top-up at any time.
              </Text.p>

              <div>
                <Text.p t="subheading" mb="s">
                  Withdraw amount
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

                {startedWithoutAllowance && (
                  <AllowanceToggle
                    mt="s"
                    tokenDisplayName="DAI"
                    onToggle={onSetAllowance}
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
                  Withdraw
                </Button>
              </Box>

              {withdrawError && (
                <Text.p t="caption" color="orange.600" textAlign="center">
                  {withdrawError}
                </Text.p>
              )}
            </Grid>
          </CardTabs>
          <AccountBox currentAccount={account} />
        </Grid>
      </Box>
    </Flex>
  );
}

export default Save;
