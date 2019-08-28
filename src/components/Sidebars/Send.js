import React, { useState } from 'react';
import {
  Text,
  Input,
  Grid,
  Link,
  Flex,
  Button,
  Box
} from '@makerdao/ui-components-core';
import { ReactComponent as PasteIcon } from '../../images/paste.svg';
import styled from 'styled-components';
import useMaker from 'hooks/useMaker';
import lang from 'languages';

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

const Send = ({ token, balance, reset }) => {
  const [amount, setAmount] = useState('');
  const [destAddress, setDestAddress] = useState('');
  const setMax = () => null;
  const paste = () => null;
  const send = () => null;
  const valid = true;

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
          placeholder={`0.00 ${token}`}
          after={
            <Link fontWeight="medium" onClick={setMax}>
              {lang.action_sidebar.set_max}
            </Link>
          }
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
          placeholder="0x..."
          after={<PasteAddress onClick={paste} />}
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
