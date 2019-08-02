import React from 'react';
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
import { Routes } from '../utils/constants';
import { Link } from 'react-navi';
import AccountBox from '../components/AccountBox';
import CardTabs from '../components/CardTabs';
import useMaker from '../hooks/useMaker';
import { ReactComponent as DaiLogo } from 'images/dai.svg';

function Save() {
  const { account } = useMaker();
  return (
    <Flex justifyContent="center" mt="xl">
      <Link href={`/${Routes.BORROW}`}>/Borrow</Link>
      <Box px="m">
        <Text.p t="h4" mb="s">
          Balance
        </Text.p>
        <Grid
          gridTemplateColumns={{ m: '1fr', l: '437px 352px' }}
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

              <div>
                <Text.p t="subheading" mb="s">
                  Deposit amount
                </Text.p>
                <Input
                  placeholder="0 DAI"
                  after={<Link fontWeight="medium">Set max</Link>}
                />
              </div>

              <Box justifySelf="center">
                <Button>Deposit Dai</Button>
              </Box>
            </Grid>
          </CardTabs>
        </Grid>
        <AccountBox currentAccount={account} />
      </Box>
    </Flex>
  );
}

export default Save;
