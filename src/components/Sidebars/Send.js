import React, { useState, useEffect } from 'react';
import { Text, Input, Grid, Link, Button } from '@makerdao/ui-components-core';
import { ReactComponent as PasteIcon } from '../../images/paste.svg';
import styled from 'styled-components';
import usePrevious from '../../hooks/usePrevious';
import lang from 'languages';
import BigNumber from 'bignumber.js';
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

const SetMaxLink = ({ token, setMax }) => {
  return token === 'ETH' ? null : (
    <Link fontWeight="medium" onClick={setMax}>
      {lang.action_sidebar.set_max}
    </Link>
  );
};

const Send = ({ token, balance, reset }) => {
  const [amount, setAmount] = useState('');
  const [destAddress, setDestAddress] = useState('');

  const previousToken = usePrevious(token);
  useEffect(() => {
    if (previousToken !== token) {
      setAmount('');
    }
  }, [token]);
  const setMax = () => setAmount(balance.toString());
  const paste = async () => {
    const contents = await navigator.clipboard.readText();
    setDestAddress(contents);
  };
  const send = () => null;

  const amountBig = BigNumber(amount);
  const amountIsValid =
    amount === '' || (amountBig.gt(0) && amountBig.lte(balance));
  const amountFailureMessage = amountIsValid
    ? ''
    : 'The amount you wish to send is invalid';

  const destAddressIsValid =
    destAddress === '' || isValidAddressString(destAddress);
  const destAddressFailureMessage = destAddressIsValid
    ? ''
    : 'This is not a valid address';

  const valid =
    amount !== '' && destAddress !== '' && amountIsValid && destAddressIsValid;

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
          onChange={evt => setAmount(evt.target.value)}
          onFocus={e => {
            const tmp = e.target.value;
            e.target.value = '';
            e.target.value = tmp;
          }}
          placeholder={`0.00 ${token}`}
          after={<SetMaxLink {...{ token, setMax }} />}
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
          <Button onClick={send} disabled={!valid}>
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
