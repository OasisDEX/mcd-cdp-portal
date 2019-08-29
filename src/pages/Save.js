import React, { useState, useCallback } from 'react';
import {
  Box,
  Flex,
  Grid,
  Card,
  CardBody,
  Text,
  Table,
  Input,
  Button
} from '@makerdao/ui-components-core';
import { MDAI } from '@makerdao/dai-plugin-mcd';

import { Link } from 'react-navi';
import CardTabs from '../components/CardTabs';
import useMaker from '../hooks/useMaker';
import AccountBox from '../components/AccountBox';
import { ReactComponent as DaiLogo } from 'images/dai.svg';

function ActionInput({
  inputTitle,
  input,
  button,
  validateInput = () => true,
  invalidMessage,
  action
}) {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const onChange = useCallback(evt => {
    const newValue = evt.target.value;
    const isValid = validateInput(newValue);
    setIsValid(isValid);

    setErrorMessage(isValid ? '' : invalidMessage);
    setInputValue(newValue);
  });

  const onAction = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      await action(inputValue);
      setInputValue('');
    } catch (err) {
      setErrorMessage('An error occurred. Please try again.');
    }

    setIsLoading(false);
  }, [inputValue]);

  return (
    <>
      <div>
        <Text.p t="subheading" mb="s">
          {inputTitle}
        </Text.p>
        {React.cloneElement(input, {
          onChange,
          value: inputValue,
          error: errorMessage,
          failureMessage: errorMessage
          // after: <Link fontWeight="medium" color="blue">Set max</Link>
        })}
      </div>

      <Box justifySelf="center">
        {React.cloneElement(button, {
          disabled: isLoading || !isValid,
          loading: isLoading,
          onClick: onAction
        })}
      </Box>
    </>
  );
}

function Save() {
  const { maker, account } = useMaker();

  const onDeposit = useCallback(value => {
    return maker.service('mcd:savings').join(MDAI(value));
  });

  const onWithdraw = useCallback(value => {
    return maker.service('mcd:savings').exit(MDAI(value));
  });

  const validateInput = useCallback(value => {
    if (!value) return false;

    try {
      const num = parseFloat(value);
      return num > 0;
    } catch (err) {
      return false;
    }
  });

  const invalidMessage = 'Please enter a value greater than 0';

  return (
    <Flex justifyContent="center" mt="xl">
      <Box px="m">
        <Text.p t="h4" mb="s">
          Balance
        </Text.p>
        <Grid
          gridTemplateColumns={{ m: '1fr', l: '437px 352px 300px' }}
          gridColumnGap="l"
          gridRowGap="m"
        >
          <Card>
            <CardBody px="l" py="m">
              <Text.p t="h2">
                140,032.5011{' '}
                <Text t="h5">
                  <DaiLogo /> DAI
                </Text>
              </Text.p>
              <Text.p t="h5" mt="s" color="steel">
                140,032.5011 USD
              </Text.p>
            </CardBody>
            <CardBody px="l" py="m">
              <Table width="100%">
                <Table.tbody>
                  <Table.tr>
                    <Table.td>
                      <Text t="body">Dai Savings rate</Text>
                    </Table.td>
                    <Table.td textAlign="right">
                      <Text t="body">2.25%</Text>
                    </Table.td>
                  </Table.tr>
                  <Table.tr>
                    <Table.td>
                      <Text t="body">Locked Dai</Text>
                    </Table.td>
                    <Table.td textAlign="right">
                      <Text t="body">120,032.5001</Text>
                    </Table.td>
                  </Table.tr>
                  <Table.tr>
                    <Table.td>
                      <Text t="body">Free Dai</Text>
                    </Table.td>
                    <Table.td textAlign="right">
                      <Text t="body">10,000.0000 DAI</Text>
                    </Table.td>
                  </Table.tr>
                  <Table.tr>
                    <Table.td>
                      <Text t="body">Ratio</Text>
                    </Table.td>
                    <Table.td textAlign="right">
                      <Text t="body">87.21% locked</Text>
                    </Table.td>
                  </Table.tr>
                </Table.tbody>
              </Table>
            </CardBody>
          </Card>

          <CardTabs headers={['Deposit', 'Withdraw']}>
            <Grid px="l" py="m" gridRowGap="m">
              <Text.p t="body">
                Receive interest on your Dai. Withdraw or top-up at any time.
              </Text.p>

              <ActionInput
                inputTitle="Deposit amount"
                validateInput={validateInput}
                invalidMessage={invalidMessage}
                input={<Input type="number" min="0" placeholder="0 DAI" />}
                button={<Button>Deposit</Button>}
                action={onDeposit}
              />
            </Grid>
            <Grid px="l" py="m" gridRowGap="m">
              <Text.p t="body">
                Receive interest on your Dai. Withdraw or top-up at any time.
              </Text.p>

              <ActionInput
                inputTitle="Withdraw amount"
                validateInput={validateInput}
                invalidMessage={invalidMessage}
                input={<Input type="number" min="0" placeholder="0 DAI" />}
                button={<Button>Withdraw</Button>}
                action={onWithdraw}
              />
            </Grid>
          </CardTabs>
          <AccountBox currentAccount={account} />
        </Grid>
      </Box>
    </Flex>
  );
}

export default Save;
