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

const defaultFromToken = 'USDC';
const defaultToToken = 'DAI';

const stableTokenList = ['USDC', 'DAI', 'TUSD'];

const tokenImages = {
  USDC: UsdcToken,
  DAI: DaiToken,
  TUSD: TusdToken
};

function Arbitrage({ viewedAddress }) {
  const { lang } = useLanguage();

  const balances = useWalletBalances();

  const [fromToken, setFromToken] = useState(defaultFromToken);
  const [toToken, setToToken] = useState(defaultToToken);

  const viewedProxyAddress = watch.proxyAddress(viewedAddress);

  const maxFromAmount =
    balances && balances[fromToken] ? balances[fromToken] : 0;
  const maxToAmount = balances && balances[toToken] ? balances[toToken] : 0;

  const tokenList = stableTokenList.filter(
    tkn => tkn !== fromToken && tkn !== toToken
  );

  const [
    fromAmount,
    setFromAmount,
    onFromAmountChange,
    fromAmountErrors
  ] = useValidatedInput(
    '',
    {
      maxFloat: maxFromAmount,
      minFloat: 0,
      isFloat: true
    },
    {
      maxFloat: () =>
        lang.formatString(
          lang.arb.insufficient_balance,
          maxFromAmount,
          fromToken
        )
    }
  );

  const [toAmount, , onToAmountChange, toAmountErrors] = useValidatedInput(
    '',
    {
      maxFloat: maxToAmount,
      minFloat: 0,
      isFloat: true
    },
    {
      maxFloat: () =>
        lang.formatString(lang.arb.insufficient_balance, maxToAmount)
    }
  );

  const maxPaybackAmount = maxFromAmount;
  const setMax = () => setFromAmount(maxPaybackAmount.toString());

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
            <Grid gridRowGap="l" py="xl" px="xl">
              <Grid gridRowGap="m">
                <Text.p fontWeight="medium">{lang.arb.from}</Text.p>

                <Grid gridRowGap="s">
                  <Grid
                    gridTemplateColumns="3fr 1fr"
                    alignItems="center"
                    gridColumnGap="l"
                  >
                    <Input
                      type="number"
                      value={fromAmount}
                      min="0"
                      onChange={onFromAmountChange}
                      placeholder="0.00"
                      after={<SetMax onClick={setMax} />}
                    />
                    <Dropdown trigger={<DropdownButton token={fromToken} />}>
                      <DefaultDropdown>
                        <Grid gridRowGap="m" px="s">
                          {tokenList.map((tkn, idx) => {
                            const TokenImage = tokenImages[tkn];
                            return (
                              <Grid
                                key={`from-${idx}`}
                                onClick={() => setFromToken(tkn)}
                                gridTemplateColumns="1fr 1fr"
                              >
                                <TokenImage height="20px" width="20px" />
                                {tkn}
                              </Grid>
                            );
                          })}
                        </Grid>
                      </DefaultDropdown>
                    </Dropdown>
                  </Grid>
                  {fromAmountErrors && (
                    <Text.p fontSize="s" color="red">
                      {fromAmountErrors}
                    </Text.p>
                  )}
                </Grid>

                <Grid textAlign="center" gridTemplateColumns="3fr 1fr">
                  <Grid gridTemplateColumns="1fr 1fr">
                    <Text.p
                      textAlign="left"
                      alignSelf="end"
                      fontWeight="medium"
                    >
                      {lang.arb.to}
                    </Text.p>

                    <SwapToken
                      onClick={() => {
                        setToToken(fromToken);
                        setFromToken(toToken);
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
                      value={toAmount}
                      min="0"
                      onChange={onToAmountChange}
                      placeholder="0.00"
                    />
                    <Dropdown trigger={<DropdownButton token={toToken} />}>
                      <DefaultDropdown>
                        <Grid gridRowGap="m" px="s">
                          {tokenList.map((tkn, idx) => {
                            const TokenImage = tokenImages[tkn];
                            return (
                              <Grid
                                key={`to-${idx}`}
                                onClick={() => setToToken(tkn)}
                                gridTemplateColumns="1fr 1fr"
                              >
                                <TokenImage height="20px" width="20px" />
                                {tkn}
                              </Grid>
                            );
                          })}
                        </Grid>
                      </DefaultDropdown>
                    </Dropdown>
                  </Grid>
                  {toAmountErrors && (
                    <Text.p fontSize="s" color="red">
                      {toAmountErrors}
                    </Text.p>
                  )}
                </Grid>
              </Grid>

              <Grid gridRowGap="xs">
                <Grid gridTemplateColumns="1fr 5fr" alignItems="center">
                  <Text t="subheading">{lang.arb.swapping}:</Text>
                  <Text>
                    {lang.formatString(
                      lang.arb.swapping_from_to,
                      fromAmount ? fromAmount.toString() : '0.00',
                      fromToken,
                      toAmount ? toAmount.toString() : '0.00',
                      toToken
                    )}
                  </Text>
                </Grid>

                <Grid gridTemplateColumns="1fr 5fr" alignItems="center">
                  <Text t="subheading">{lang.arb.fee_to_swap}:</Text>
                  <Text>
                    {toAmount ? toAmount.toString() : '0.00'} {toToken} (2.00%)
                  </Text>
                </Grid>
              </Grid>

              <Grid gridTemplateColumns="1fr 2fr 2fr 1fr" gridColumnGap="m">
                <Box />
                <Button>
                  {lang.formatString(lang.arb.approve, fromToken)}
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
