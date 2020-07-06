import React, { useState } from 'react';
import PageContentLayout from 'layouts/PageContentLayout';
import LoadingLayout from 'layouts/LoadingLayout';
import useMaker from 'hooks/useMaker';
import useLanguage from 'hooks/useLanguage';
import { watch } from 'hooks/useObservable';
import {
  Flex,
  Text,
  Button,
  Card,
  Grid,
  Input,
  Box
} from '@makerdao/ui-components-core';
import useValidatedInput from 'hooks/useValidatedInput';
import useWalletBalances from 'hooks/useWalletBalances';
import SetMax from 'components/SetMax';

function Arbitrage({ viewedAddress }) {
  const { lang } = useLanguage();
  const { account } = useMaker();
  const viewedProxyAddress = watch.proxyAddress(viewedAddress);
  const balances = useWalletBalances();
  const usdcBalance = balances.USDC;

  const daiUsd = '1.0125';

  const maxBaseAmount = usdcBalance;
  const maxQuoteAmount = usdcBalance;

  const [
    baseAmount,
    setBaseAmount,
    onBaseAmountChange,
    baseAmountErrors
  ] = useValidatedInput(
    '',
    {
      maxFloat: maxBaseAmount,
      minFloat: 0,
      isFloat: true
    },
    {
      maxFloat: () =>
        lang.formatString(lang.action_sidebar.insufficient_balance, 'USDC')
    }
  );

  const [
    quoteAmount,
    ,
    onQuoteAmountChange,
    quoteAmountErrors
  ] = useValidatedInput(
    '',
    {
      maxFloat: maxQuoteAmount,
      minFloat: 0,
      isFloat: true
    },
    {
      maxFloat: () =>
        lang.formatString(lang.action_sidebar.insufficient_balance, 'USDC')
    }
  );

  const maxPaybackAmount = usdcBalance;
  const setMax = () => setBaseAmount(maxPaybackAmount.toString());

  const fetchingProxyStatus = viewedProxyAddress === undefined;

  return fetchingProxyStatus ? (
    <LoadingLayout />
  ) : (
    <PageContentLayout>
      <Grid
        gridTemplateColumns={{
          0: '1fr',
          1: '1fr',
          2: '1fr',
          xl: '1fr 4fr 1fr'
        }}
        alignItems="center"
        height="70vh"
      >
        <Box />
        <Grid gridRowGap="xl">
          <Text.h1 textAlign="center" fontWeight="semibold">
            {lang.arb.title}
          </Text.h1>
          <Card p="l">
            <Grid gridRowGap="l" py="xl" px="l">
              <Grid gridRowGap="s">
                <Text.p>{lang.arb.from}</Text.p>
                <Grid
                  gridTemplateColumns="3fr 1fr"
                  alignItems="center"
                  gridColumnGap="l"
                >
                  <Input
                    type="number"
                    value={baseAmount}
                    min="0"
                    onChange={onBaseAmountChange}
                    placeholder="0.00"
                    after={<SetMax onClick={setMax} />}
                  />
                  <Box bg="steel" height="100%">
                    sss
                  </Box>
                </Grid>
                {baseAmountErrors && (
                  <Text.p fontSize="s" color="red">
                    {baseAmountErrors}
                  </Text.p>
                )}
              </Grid>

              <Grid gridRowGap="s">
                <Text.p>{lang.arb.to}</Text.p>
                <Grid
                  gridTemplateColumns="3fr 1fr"
                  alignItems="center"
                  gridColumnGap="l"
                >
                  <Input
                    type="number"
                    value={quoteAmount}
                    min="0"
                    onChange={onQuoteAmountChange}
                    placeholder="0.00"
                  />
                  <Box bg="steel" height="100%">
                    sss
                  </Box>
                </Grid>
                {quoteAmountErrors && (
                  <Text.p fontSize="s" color="red">
                    {quoteAmountErrors}
                  </Text.p>
                )}
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Box />
      </Grid>
    </PageContentLayout>
  );
}

export default Arbitrage;
