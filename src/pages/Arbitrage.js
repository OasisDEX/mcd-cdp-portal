import React, { useState } from 'react';
import PageContentLayout from 'layouts/PageContentLayout';
import LoadingLayout from 'layouts/LoadingLayout';
import useLanguage from 'hooks/useLanguage';
import { watch } from 'hooks/useObservable';
import {
  Text,
  Button,
  Card,
  Grid,
  Input,
  Box,
  Dropdown,
  DefaultDropdown
} from '@makerdao/ui-components-core';
import useValidatedInput from 'hooks/useValidatedInput';
import useWalletBalances from 'hooks/useWalletBalances';
import SetMax from 'components/SetMax';
import { ReactComponent as SwapToken } from 'images/swap-tokens.svg';
import { ReactComponent as UsdcToken } from 'images/oasis-tokens/usdc.svg';
import { ReactComponent as DaiToken } from 'images/oasis-tokens/dai.svg';
import { ReactComponent as PaxToken } from 'images/oasis-tokens/pax.svg';
import { ReactComponent as TusdToken } from 'images/oasis-tokens/tusd.svg';
import { ReactComponent as RepToken } from 'images/oasis-tokens/rep.svg';
import { ReactComponent as CaratDown } from 'images/carat-down.svg';

const defaultBaseToken = 'USDC';
const defaultQuoteToken = 'DAI';

const stableTokenList = ['USDC', 'DAI', 'TUSD', 'PAX', 'USDT'];

const tokenImages = {
  USDC: UsdcToken,
  DAI: DaiToken,
  TUSD: TusdToken,
  PAX: PaxToken,
  USDT: RepToken
};

function Arbitrage({ viewedAddress }) {
  const { lang } = useLanguage();

  const viewedProxyAddress = watch.proxyAddress(viewedAddress);
  const balances = useWalletBalances();

  const [baseToken, setBaseToken] = useState(defaultBaseToken);
  const [quoteToken, setQuoteToken] = useState(defaultQuoteToken);

  const maxBaseAmount =
    balances && balances[baseToken] ? balances[baseToken] : 0;
  const maxQuoteAmount =
    balances && balances[quoteToken] ? balances[quoteToken] : 0;

  const tokenList = stableTokenList.filter(
    tkn => tkn !== baseToken && tkn !== quoteToken
  );

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
        lang.formatString(
          lang.arb.insufficient_balance,
          maxBaseAmount,
          baseToken
        )
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
        lang.formatString(lang.arb.insufficient_balance, maxQuoteAmount)
    }
  );

  const maxPaybackAmount = maxBaseAmount;
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
          xl: '1fr 5fr 1fr'
        }}
        alignItems="center"
        height="70vh"
      >
        <Box />
        <Grid gridRowGap="xl">
          <Text.h1 textAlign="center" fontWeight="medium">
            {lang.arb.title}
          </Text.h1>
          <Card>
            <Grid gridRowGap="m" py="xl" px="xl">
              <Text.p fontWeight="medium">{lang.arb.from}</Text.p>

              <Grid gridRowGap="s">
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
                  <Dropdown trigger={<DropdownButton token={baseToken} />}>
                    <DefaultDropdown>
                      {tokenList.map((tkn, idx) => {
                        const TokenImage = tokenImages[tkn];
                        return (
                          <Grid
                            key={`quote-${idx}`}
                            onClick={() => setBaseToken(tkn)}
                            gridTemplateColumns="1fr 1fr"
                          >
                            <TokenImage height="20px" width="20px" />
                            {tkn}
                          </Grid>
                        );
                      })}
                    </DefaultDropdown>
                  </Dropdown>
                </Grid>
                {baseAmountErrors && (
                  <Text.p fontSize="s" color="red">
                    {baseAmountErrors}
                  </Text.p>
                )}
              </Grid>

              <Grid textAlign="center" gridTemplateColumns="3fr 1fr">
                <Grid gridTemplateColumns="1fr 1fr">
                  <Text.p textAlign="left" alignSelf="end" fontWeight="medium">
                    {lang.arb.to}
                  </Text.p>

                  <SwapToken
                    onClick={() => {
                      setQuoteToken(baseToken);
                      setBaseToken(quoteToken);
                    }}
                  />
                </Grid>
                <Box />
              </Grid>

              <Grid gridRowGap="s">
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
                  <Dropdown trigger={<DropdownButton token={quoteToken} />}>
                    <DefaultDropdown>
                      {tokenList.map((tkn, idx) => {
                        const TokenImage = tokenImages[tkn];
                        return (
                          <Grid
                            key={`quote-${idx}`}
                            onClick={() => setQuoteToken(tkn)}
                            gridTemplateColumns="1fr 1fr"
                          >
                            <TokenImage height="20px" width="20px" />
                            {tkn}
                          </Grid>
                        );
                      })}
                    </DefaultDropdown>
                  </Dropdown>
                </Grid>
                {quoteAmountErrors && (
                  <Text.p fontSize="s" color="red">
                    {quoteAmountErrors}
                  </Text.p>
                )}
              </Grid>

              <Grid gridTemplateColumns="1fr 2fr 2fr 1fr" gridColumnGap="m">
                <Box />
                <Button>
                  {lang.formatString(lang.arb.approve, baseToken)}
                </Button>
                <Button variant="secondary">{lang.arb.swap}</Button>
                <Box />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Box />
      </Grid>
    </PageContentLayout>
  );
}

const DropdownButton = ({ token }) => {
  const TokenImage = tokenImages[token];
  return (
    <Grid
      borderRadius="default"
      gridTemplateColumns="1fr 1fr 2fr"
      alignItems="center"
      gridColumnGap="s"
      bg="coolGrey.200"
      height="50px"
      px="s"
    >
      <TokenImage display="block" width="25px" height="25px" />
      {token}
      <Box textAlign="right">
        <CaratDown />
      </Box>
    </Grid>
  );
};

export default Arbitrage;
