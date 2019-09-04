import React, { useState, useEffect } from 'react';
import { Text, Input, Grid, Link, Button } from '@makerdao/ui-components-core';
import { ReactComponent as PasteIcon } from '../../images/paste.svg';
import styled from 'styled-components';
import usePrevious from '../../hooks/usePrevious';
import useMaker from '../../hooks/useMaker';
import useValidatedInput from '../../hooks/useValidatedInput';
import lang from 'languages';
import BigNumber from 'bignumber.js';
import SetMax from '../SetMax';
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

const gasLimit = BigNumber(21000);

const Send = ({ token, balance, reset }) => {
  const { maker, account, newTxListener } = useMaker();
  const { address } = account;
  const [gasCost, setGasCost] = useState(0);
  const [destAddress, setDestAddress] = useState('');

  const minAmount = token === 'ETH' ? gasCost : 0;
  const maxAmount = token === 'ETH' ? balance - gasCost : balance;

  const displayToken = token === 'MDAI' ? 'DAI' : token;

  const inRangeNotEth = (_token, _val) =>
    _token !== 'ETH' || _val < 0 || _val > balance;
  const [amount, setAmount, onAmountChange, amountErrors] = useValidatedInput(
    '',
    {
      custom: {
        valid: val => !isNaN(parseFloat(val)),
        minEth: val =>
          gasCost <= balance || inRangeNotEth(token, parseFloat(val)),
        min: val => parseFloat(val) >= 0,
        maxEth: val =>
          parseFloat(val) + gasCost <= balance ||
          inRangeNotEth(token, parseFloat(val)),
        max: val => val <= balance
      }
    },
    {
      valid: _ => lang.action_sidebar.invalid_input,
      minEth: _ =>
        lang.formatString(
          lang.action_sidebar.invalid_min_gas,
          `${gasCost} ${displayToken}`
        ),
      min: _ =>
        lang.formatString(lang.action_sidebar.invalid_min_amount, displayToken),
      maxEth: _ =>
        lang.formatString(
          lang.action_sidebar.invalid_max_gas,
          `${gasCost} ${displayToken}`
        ),
      max: _ => lang.action_sidebar.invalid_max_amount
    }
  );

  const prevToken = usePrevious(token);
  const prevAddress = usePrevious(address);

  const calculateGasCost = async () => {
    const gasPrice = await maker.service('gas').getGasPrice('fast');
    const gasCost = gasLimit
      .times(gasPrice)
      .shiftedBy(-18)
      .toNumber();

    setGasCost(gasCost);
  };

  useEffect(() => {
    if (prevToken !== token) {
      setAmount('');
      setGasCost(0);
      setDestAddress('');
    }
    if (prevAddress !== address) reset();
    calculateGasCost();
  }, [token, address, prevToken, prevAddress]);

  const setMax = async () => {
    await calculateGasCost();
    setAmount(maxAmount);
  };

  const paste = async () => {
    const copiedAddress = await navigator.clipboard.readText();
    setDestAddress(copiedAddress);
  };

  const amountIsValid = amount >= minAmount && amount <= maxAmount;

  const destAddressIsValid =
    destAddress === '' || isValidAddressString(destAddress);
  const destAddressFailureMessage = destAddressIsValid
    ? ''
    : lang.action_sidebar.invalid_address;

  const valid =
    amount !== '' && destAddress !== '' && amountIsValid && destAddressIsValid;

  const showSetMax = token !== 'ETH' || balance >= gasCost;

  const transfer = async () => {
    const _token = token === 'DAI' ? 'MDAI' : token;
    const daiToken = maker.getToken(_token);
    newTxListener(
      daiToken.transfer(destAddress, amount),
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
          onChange={onAmountChange}
          onFocus={e => {
            const tmp = e.target.value;
            e.target.value = '';
            e.target.value = tmp;
          }}
          placeholder={`0.00 ${displayToken}`}
          after={<>{showSetMax && <SetMax onClick={setMax} />}</>}
          failureMessage={amountErrors}
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
          onChange={evt => setDestAddress(evt.target.value)}
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
