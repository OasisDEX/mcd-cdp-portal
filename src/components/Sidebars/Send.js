import React, { useState, useEffect } from 'react';
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
      {lang.action_sidebar.paste}
      <StyledPaste />
    </Grid>
  </PasteLink>
);

const SetMaxLink = ({ token, setMax, hasSurplusETH }) =>
  (token !== 'ETH' || hasSurplusETH) && (
    <Link fontWeight="medium" onClick={setMax}>
      {lang.action_sidebar.set_max}
    </Link>
  );

const gasLimit = BigNumber(21000);

const Send = ({ token, balance, reset }) => {
  const [amount, setAmount] = useState('');
  const [destAddress, setDestAddress] = useState('');

  const [gasOffset, setGasOffset] = useState(false);
  const [
    enoughBalanceForGasAndAmount,
    setEnoughBalanceForGasAndAmount
  ] = useState(true);
  const [amountGreaterThanBalance, setAmountGreaterThanBalance] = useState(
    false
  );
  const [hasSurplusETH, setHasSurplusETH] = useState(false);

  const { maker, account, newTxListener } = useMaker();
  const { address } = account;
  const prevToken = usePrevious(token);
  const prevAddress = usePrevious(address);

  const calculateEthOffset = async () => {
    const gasPrice = await maker.service('gas').getGasPrice('fast');
    const gasCost = gasLimit.times(gasPrice).shiftedBy(-18);
    setGasOffset(gasCost.toNumber());
    if (token === 'ETH' && balance.minus(gasCost.toNumber()).gte(0)) {
      setHasSurplusETH(true);
    } else {
      setEnoughBalanceForGasAndAmount(false);
    }
  };

  useEffect(() => {
    if (prevToken !== token) {
      setAmount('');
      setDestAddress('');
      setEnoughBalanceForGasAndAmount(true);
      setHasSurplusETH(false);
      setGasOffset(false);
    }
    if (prevAddress !== address) reset();
    if (token === 'ETH' && !gasOffset) calculateEthOffset();
  }, [token, address, prevToken, prevAddress]);

  const updateAmount = value => {
    setAmountGreaterThanBalance(balance.minus(value).lt(0));
    if (token === 'ETH') {
      setEnoughBalanceForGasAndAmount(
        balance.minus(BigNumber(value).plus(gasOffset)).gte(0)
      );
      setAmount(value);
    } else {
      setAmount(value);
    }
  };

  const setMax = () => {
    if (token === 'ETH' && gasOffset && hasSurplusETH) {
      updateAmount(balance.minus(gasOffset));
    } else {
      setAmount(balance);
    }
  };

  const paste = async () => {
    const contents = await navigator.clipboard.readText();
    setDestAddress(contents);
  };

  const amountBig = BigNumber(amount);
  const amountIsValid =
    amount === '' ||
    (amountBig.gt(0) &&
      (token === 'ETH'
        ? hasSurplusETH && enoughBalanceForGasAndAmount
        : !amountGreaterThanBalance));

  const amountFailureMessage = amountIsValid
    ? ''
    : token === 'ETH'
    ? hasSurplusETH && enoughBalanceForGasAndAmount
      ? lang.action_sidebar.invalid_amount
      : amountGreaterThanBalance
      ? lang.action_sidebar.invalid_amount
      : lang.action_sidebar.invalid_gas
    : lang.action_sidebar.invalid_amount;

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
          after={<SetMaxLink {...{ token, setMax, hasSurplusETH }} />}
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
