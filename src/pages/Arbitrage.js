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
  const [showOnboarding] = useState(true);
  const balances = useWalletBalances();
  console.log(balances);
  const usdcBalance = balances.USDC;

  const daiUsd = '1.0125';

  const [amount, setAmount, onAmountChange, amountErrors] = useValidatedInput(
    '',
    {
      maxFloat: usdcBalance,
      minFloat: 0,
      isFloat: true
    },
    {
      maxFloat: () =>
        lang.formatString(lang.action_sidebar.insufficient_balance, 'USDC')
    }
  );
  const maxPaybackAmount = usdcBalance;

  const setMax = () => setAmount(maxPaybackAmount.toString());

  return (
    <PageContentLayout>
      {viewedProxyAddress === undefined ? (
        <Flex
          height="70vh"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <LoadingLayout />
        </Flex>
      ) : viewedProxyAddress === null && showOnboarding ? (
        <Flex
          height="70vh"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          {viewedAddress === account?.address ? (
            <>
              <Text.p t="h4" mb="26px">
                {lang.formatString(lang.arb.get_started_title, daiUsd)}
              </Text.p>
              <Button p="s" css={{ cursor: 'pointer' }} onClick={() => null}>
                {lang.actions.get_started}
              </Button>
            </>
          ) : (
            <Text.p>{lang.arb.no_arb}</Text.p>
          )}
        </Flex>
      ) : (
        <Grid
          gridTemplateColumns={{
            0: '1fr',
            1: '1fr',
            xl: '1fr 1fr 1fr'
          }}
          alignItems="center"
          height="70vh"
        >
          <Box />
          <Card p="l">
            <Grid gridRowGap="l">
              <Text.h3>{lang.arb.title}</Text.h3>
              <Text.p>{'Lorem ipsum dolor sit amet, consectetur'}</Text.p>

              <Grid
                gridTemplateColumns="1fr 5fr"
                alignItems="center"
                gridColumnGap="s"
              >
                <Text.p>{'USDC'}</Text.p>
                <Input
                  type="number"
                  value={amount}
                  min="0"
                  onChange={onAmountChange}
                  placeholder="0.00"
                  failureMessage={amountErrors}
                  after={<SetMax onClick={setMax} />}
                />
              </Grid>
              <Grid
                gridTemplateColumns="1fr 5fr"
                alignItems="center"
                gridColumnGap="s"
              >
                <Text.p>{'DAI '}</Text.p>

                <Input
                  type="number"
                  value={amount}
                  placeholder="0.00"
                  disabled={true}
                />
              </Grid>
              <Button>{lang.arb.swap}</Button>
            </Grid>
          </Card>
          <Box />
        </Grid>
      )}
    </PageContentLayout>
  );
}

export default Arbitrage;
