import React, { useState } from 'react';
import PageContentLayout from 'layouts/PageContentLayout';
import useLanguage from 'hooks/useLanguage';
import { watch } from 'hooks/useObservable';
import useMaker from 'hooks/useMaker';
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
import { ReactComponent as CaratDown } from 'images/carat-down.svg';
import { ReactComponent as Checkmark } from 'images/checkmark.svg';
import { defaultPsmTypes } from '@makerdao/dai-plugin-mcd';
import { formatter } from 'utils/ui';
import BigNumber from 'bignumber.js';
import { debtCeiling } from '@makerdao/dai-plugin-mcd/dist/math';
import { greaterThan } from 'utils/bignumber';

const defaultPsmType = defaultPsmTypes[0];

const tokenImages = {
  USDC: UsdcToken,
  DAI: DaiToken
};

const SuccessButton = () => {
  return (
    <Button variant="primary-outline" disabled>
      <Checkmark />
    </Button>
  );
};

const PSM_JOIN = 'join';
const PSM_EXIT = 'exit';

function Arbitrage({ viewedAddress }) {
  const { lang } = useLanguage();
  const { maker, account } = useMaker();
  const balances = useWalletBalances();

  const psmTypesInfo = watch.psmTypesInfo();
  const psmFees = watch.psmFees();
  const psmAllowances = watch.psmAllowances(account?.address);

  const [
    { currency: joinToken, pair: exitToken, ilk: psmType },
    setPsmType
  ] = useState(defaultPsmType);
  const [psmAction, setPsmAction] = useState(PSM_JOIN);

  const tokens = { [PSM_JOIN]: joinToken, [PSM_EXIT]: exitToken };

  const psmTypeCollateral = psmTypesInfo?.[psmType]?.collateral;
  // const psmTypeCeiling = psmTypesInfo?.[psmType]?.ceiling;
  // const psmTypeDebt = psmTypesInfo?.[psmType]?.debtAvailable;

  const psmTypeAllowance = psmAllowances?.[psmType];
  const hasAllowance = psmTypeAllowance?.[psmAction];

  const baseToken = tokens[psmAction];
  const quoteToken = tokens[psmAction === PSM_JOIN ? PSM_EXIT : PSM_JOIN];

  const maxBaseAmount =
    balances && balances[baseToken.symbol] ? balances[baseToken.symbol] : 0;

  const fee = psmFees?.[psmType]?.[psmAction];
  const feeAmount = fee ? `${fee.toString()}%` : '--';

  const debtCeilingValidation = value => greaterThan(value, psmTypeCollateral);

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
      isFloat: true,
      custom: {
        debtCeiling: debtCeilingValidation
      }
    },
    {
      maxFloat: () =>
        lang.formatString(
          lang.arb.insufficient_balance,
          maxBaseAmount,
          baseToken.symbol
        )
    }
  );

  const charge = exitToken(baseAmount ? baseAmount : 0).times(fee ? fee : 1);

  const quoteAmount =
    psmAction === PSM_JOIN
      ? new BigNumber(baseAmount ? baseAmount : 0).minus(charge.toBigNumber())
      : new BigNumber(baseAmount ? baseAmount : 0);

  const totalBaseAmount =
    psmAction === PSM_EXIT
      ? new BigNumber(baseAmount ? baseAmount : 0).plus(charge.toBigNumber())
      : new BigNumber(baseAmount ? baseAmount : 0);

  const setMax = () => setBaseAmount(maxBaseAmount.toString());

  const [executingAction, setExecutingAction] = useState(false);
  const action = async () => {
    const psm = maker.service('mcd:psmType').getPsmType(joinToken, psmType);
    const txMgr = maker.service('transactionManager');

    const txPromise = psm[psmAction](baseToken(baseAmount));
    setExecutingAction(true);
    txMgr.listen(txPromise, {
      confirmed: () => {
        setBaseAmount('');
        setExecutingAction(false);
      },
      error: () => {
        setExecutingAction(false);
      }
    });
    await txMgr.confirm(txPromise, 3);
  };

  const [approvingToken, setApprovingToken] = useState(false);

  const setAllowance = async () => {
    if (account && account.address) {
      const token = maker.getToken(baseToken.symbol);
      const psmAddress = maker
        .service('mcd:psmType')
        .getPsmType(joinToken, psmType).address;
      const txMgr = maker.service('transactionManager');

      const txPromise = token.approveUnlimited(psmAddress);
      setApprovingToken(true);
      await txPromise;
      txMgr.listen(txPromise, {
        confirmed: () => {
          setApprovingToken(false);
        },
        error: () => {
          setApprovingToken(false);
        }
      });
      await txMgr.confirm(txPromise, 3);
    }
  };

  const otherPsmTypes = defaultPsmTypes.filter(({ ilk }) => ilk !== psmType);
  const otherPsmAction = psmAction === PSM_JOIN ? PSM_EXIT : PSM_JOIN;

  return (
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
                {/* <Grid gridTemplateColumns="1fr 5fr" alignItems="center"> */}
                {/*   <Text t="subheading">Action:</Text> */}
                {/*   <Text> */}
                {/*     {psmAction} {baseToken.symbol} in exchange for{' '} */}
                {/*     {quoteToken.symbol} */}
                {/*   </Text> */}
                {/* </Grid> */}

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

                    {otherPsmTypes.length ? (
                      <Dropdown
                        trigger={<DropdownButton token={baseToken.symbol} />}
                      >
                        <DefaultDropdown>
                          <Grid gridRowGap="m" px="s">
                            {otherPsmTypes.map((psm, idx) => {
                              const {
                                currency: otherJoinToken,
                                pair: otherExitToken,
                                ilk: otherPsmType
                              } = psm;

                              const otherToken =
                                psmAction === PSM_JOIN
                                  ? otherJoinToken
                                  : otherExitToken;
                              const TokenImage = tokenImages[otherToken.symbol];
                              return (
                                <Grid
                                  key={`base-${idx}`}
                                  onClick={() => setPsmType()}
                                  gridTemplateColumns="1fr 1fr"
                                >
                                  <TokenImage height="20px" width="20px" />
                                  {otherPsmType}
                                </Grid>
                              );
                            })}
                          </Grid>
                        </DefaultDropdown>
                      </Dropdown>
                    ) : (
                      <DropdownButton
                        token={baseToken.symbol}
                        showCarat={false}
                      />
                    )}
                  </Grid>
                  {baseAmountErrors && (
                    <Text.p fontSize="s" color="red">
                      {baseAmountErrors}
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
                        if (approvingToken || executingAction) return null;
                        setBaseAmount('');
                        setPsmAction(otherPsmAction);
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
                      disabled={true}
                      type="number"
                      value={quoteAmount.toNumber()}
                      min="0"
                      placeholder="0.00"
                    />
                    <DropdownButton
                      token={quoteToken.symbol}
                      showCarat={false}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid gridRowGap="xs">
                <Grid gridTemplateColumns="1fr 5fr" alignItems="center">
                  <Text t="subheading">{lang.arb.swapping}:</Text>
                  <Text>
                    {lang.formatString(
                      lang.arb.swapping_from_to,
                      totalBaseAmount ? formatter(totalBaseAmount) : '0.00',
                      baseToken.symbol,
                      quoteAmount ? formatter(quoteAmount) : '0.00',
                      quoteToken.symbol
                    )}
                  </Text>
                </Grid>

                <Grid gridTemplateColumns="1fr 5fr" alignItems="center">
                  <Text t="subheading">{lang.arb.fee_to_swap}:</Text>
                  <Text>
                    {formatter(charge)} {exitToken.symbol} ({feeAmount})
                  </Text>
                </Grid>
              </Grid>

              <Grid gridTemplateColumns="1fr 2fr 2fr 1fr" gridColumnGap="m">
                <Box />
                {hasAllowance ? (
                  <SuccessButton />
                ) : (
                  <Button
                    onClick={setAllowance}
                    disabled={hasAllowance || !account?.address}
                    loading={approvingToken}
                  >
                    {lang.formatString(lang.arb.approve, baseToken.symbol)}
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={action}
                  disabled={
                    !hasAllowance || !account?.address || executingAction
                  }
                  loading={executingAction}
                >
                  {lang.arb.swap}
                </Button>
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

const DropdownButton = ({ token, showCarat = true }) => {
  const TokenImage = tokenImages[token];
  return (
    <Grid
      disabled={!showCarat}
      borderRadius="default"
      gridTemplateColumns="1fr 2fr 1fr"
      alignItems="center"
      gridColumnGap="s"
      bg="coolGrey.200"
      height="50px"
      px="s"
    >
      <TokenImage display="block" width="25px" height="25px" />
      {token}
      <Box textAlign="right">{showCarat ? <CaratDown /> : null}</Box>
    </Grid>
  );
};

export default Arbitrage;
