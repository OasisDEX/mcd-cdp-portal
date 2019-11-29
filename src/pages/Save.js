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
import AccountSelection from 'components/AccountSelection';
import ProxyAllowanceToggle from 'components/ProxyAllowanceToggle';

import useMaker from 'hooks/useMaker';
import useWalletBalances from 'hooks/useWalletBalances';
import useValidatedInput from 'hooks/useValidatedInput';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useActionState from 'hooks/useActionState';
import useStore from 'hooks/useStore';
import useLanguage from 'hooks/useLanguage';
import useDsrEventHistory from 'hooks/useDsrEventHistory';

import useModal from '../hooks/useModal';
import useProxy from '../hooks/useProxy';

function Save() {
  const { lang } = useLanguage();
  const balances = useWalletBalances();
  const { maker, account, newTxListener } = useMaker();
  const [{ accounts, savings }] = useStore();
  const { hasAllowance } = useTokenAllowance('MDAI');

  const [withdrawMaxFlag, setWithdrawMaxFlag] = useState(false);
  const { proxyAddress, hasProxy, proxyLoading } = useProxy();
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
  }, [maker, depositAmount, newTxListener]);

  const onStartWithdraw = useCallback(() => {
    let txObject;
    if (withdrawMaxFlag || new BigNumber(withdrawAmount).eq(balance)) {
      txObject = maker.service('mcd:savings').exitAll();
    } else {
      txObject = maker.service('mcd:savings').exit(MDAI(withdrawAmount));
    }
    newTxListener(txObject, lang.verbs.withdrawing);
  }, [balance, maker, withdrawAmount, withdrawMaxFlag, newTxListener]);

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

  const events = useDsrEventHistory(proxyAddress);

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
          <Text.p t="h4" css={{ marginBottom: '26px' }}>
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
              <Flex py="s" height="100%" flexDirection="column">
                <Card>
                  <CardBody px="l" py="m">
                    <Text.p t="h2">
                      {balance.toFixed(4)} <Text t="h5"> DAI</Text>
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
              </Flex>

              <Grid py="s" height="100%" flexDirection="column">
                <CardTabs
                  headers={[lang.actions.deposit, lang.actions.withdraw]}
                >
                  <Grid px="l" py="m" gridRowGap="m">
                    <Text.p t="body">{lang.save.description}</Text.p>

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

                    <Box my="xs" mx="xl" px="xl">
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

                    <Text.p t="subheading" mb="s">
                      {lang.save.withdraw_amount}
                    </Text.p>
                    <Input
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

                    <Box my="xs" mx="xl" px="xl">
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
          </Grid>
        </>
      )}
    </PageContentLayout>
  );
}

export default Save;
