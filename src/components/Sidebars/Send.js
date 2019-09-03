import React, { useReducer, useEffect } from 'react';
import { Text, Input, Grid, Link, Button } from '@makerdao/ui-components-core';
import { ReactComponent as PasteIcon } from '../../images/paste.svg';
import styled from 'styled-components';
import usePrevious from '../../hooks/usePrevious';
import lang from 'languages';
import BigNumber from 'bignumber.js';
import useMaker from '../../hooks/useMaker';
import { isValidAddressString } from '../../utils/ethereum';

const PasteLink = styled(Link)``;

const StyledPaste = styled(PasteIcon)`
  margin-left: 4px;
  path {
    fill: ${({ theme }) => theme.colors.linkBlue};
  }
  ${PasteLink}:hover & {
    path {
      fill: ${({ theme }) => theme.colors.slate['600']};
    }
  }
`;

const PasteAddress = props => (
  <PasteLink fontWeight="medium" {...props}>
    <Grid gridTemplateColumns="auto 1fr">
      {lang.paste}
      <StyledPaste />
    </Grid>
  </PasteLink>
);

const SetMaxLink = ({ setMax, showSetMax }) =>
  showSetMax && (
    <Link fontWeight="medium" onClick={setMax}>
      {lang.set_max}
    </Link>
  );

const generateFailureMessage = ({
  amountIsValid,
  token,
  balanceGtAmountPlusGas,
  amountGtBalance,
  balanceGtGas
}) => {
  if (amountIsValid) return '';
  if (amountGtBalance) return lang.action_sidebar.invalid_amount;
  if (token === 'ETH') {
    if (!(balanceGtGas && balanceGtAmountPlusGas))
      return lang.action_sidebar.invalid_gas;
  }
  return lang.action_sidebar.invalid_input;
};

const gasLimit = BigNumber(21000);

const initialState = {
  amount: '',
  destAddress: '',
  gasOffset: false,
  balanceGtAmountPlusGas: true,
  amountGtBalance: false,
  balanceGtGas: false
};

const Send = ({ token, balance, reset }) => {
  const { maker, account, newTxListener } = useMaker();
  const { address } = account;

  const [
    {
      amount,
      destAddress,
      gasOffset,
      balanceGtAmountPlusGas,
      amountGtBalance,
      balanceGtGas
    },
    updateState
  ] = useReducer((state, updates) => ({ ...state, ...updates }), initialState);

  const prevToken = usePrevious(token);
  const prevAddress = usePrevious(address);

  const calculateEthOffset = async () => {
    const gasPrice = await maker.service('gas').getGasPrice('fast');
    const gasCost = gasLimit
      .times(gasPrice)
      .shiftedBy(-18)
      .toNumber();

    if (token === 'ETH' && balance.minus(gasCost).gte(0)) {
      updateState({
        gasOffset: gasCost,
        balanceGtGas: true
      });
    } else {
      updateState({
        gasOffset: gasCost,
        balanceGtAmountPlusGas: false
      });
    }
  };

  useEffect(() => {
    if (prevToken !== token) updateState(initialState);
    if (prevAddress !== address) reset();
    if (token === 'ETH' && !gasOffset) calculateEthOffset();
  }, [token, address, prevToken, prevAddress]);

  const updateAmount = value => {
    updateState({
      amount: value,
      amountGtBalance: balance.minus(value).lt(0),
      balanceGtAmountPlusGas:
        token === 'ETH'
          ? balance.minus(BigNumber(value).plus(gasOffset)).gte(0)
          : balanceGtAmountPlusGas
    });
  };

  const setMax = async () => {
    if (token === 'ETH' && gasOffset && balanceGtGas) {
      await calculateEthOffset();
      updateAmount(balance.minus(gasOffset));
    } else {
      updateState({ amount: balance });
    }
  };

  const paste = async () => {
    const copiedAddress = await navigator.clipboard.readText();
    updateState({ destAddress: copiedAddress });
  };

  const amountBig = BigNumber(amount);
  const amountIsValid =
    amount === '' ||
    (amountBig.gt(0) &&
      (token === 'ETH'
        ? balanceGtGas && balanceGtAmountPlusGas
        : !amountGtBalance));

  const amountFailureMessage = generateFailureMessage({
    amountIsValid,
    token,
    balanceGtAmountPlusGas,
    amountGtBalance,
    balanceGtGas
  });

  const destAddressIsValid =
    destAddress === '' || isValidAddressString(destAddress);
  const destAddressFailureMessage = destAddressIsValid
    ? ''
    : lang.action_sidebar.invalid_address;

  const valid =
    amount !== '' && destAddress !== '' && amountIsValid && destAddressIsValid;

  const transfer = async () => {
    const _token = token === 'DAI' ? 'MDAI' : token;
    const tokenObj = maker.getToken(_token);
    newTxListener(
      tokenObj.transfer(destAddress, amount),
      lang.formatString(lang.action_sidebar.send_token_desc, token)
    );
    reset();
  };

  return (
    <Grid gridRowGap="m">
      <Grid gridRowGap="s">
        <Text color="darkLavender" t="h4">
          {lang.formatString(lang.action_sidebar.send_title, token)}
        </Text>

        <p>
          <Text t="body">
            {lang.formatString(lang.action_sidebar.send_description, token)}
          </Text>
        </p>
        <Input
          type="number"
          min="0"
          value={amount}
          onChange={evt => updateAmount(evt.target.value)}
          onFocus={e => {
            const tmp = e.target.value;
            e.target.value = '';
            e.target.value = tmp;
          }}
          placeholder={`0.00 ${token}`}
          after={
            <SetMaxLink
              setMax={setMax}
              showSetMax={token !== 'ETH' || balanceGtGas}
            />
          }
          failureMessage={amountFailureMessage}
        />

        <Grid gridTemplateColumns="auto 1fr" gridColumnGap="s" alignItems="end">
          <Text color="steel" fontWeight="semibold" t="smallCaps">
            {lang.action_sidebar.your_balance}
          </Text>
          <Text color="text">
            {(balance && balance.toFixed(3)) || '--'} {token}
          </Text>
        </Grid>

        <p>
          <Text t="body">
            {lang.formatString(lang.action_sidebar.dest_address, token)}
          </Text>
        </p>
        <Input
          type="text"
          value={destAddress}
          onChange={evt => updateState({ destAddress: evt.target.value })}
          onFocus={e => {
            const tmp = e.target.value;
            e.target.value = '';
            e.target.value = tmp;
          }}
          placeholder="0x..."
          after={<PasteAddress onClick={paste} />}
          failureMessage={destAddressFailureMessage}
        />
        <Grid gridTemplateColumns="1fr 1fr" gridColumnGap="s" mt="m">
          <Button onClick={transfer} disabled={!valid}>
            {lang.actions.send}
          </Button>
          <Button variant="secondary-outline" onClick={reset}>
            {lang.cancel}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Send;
