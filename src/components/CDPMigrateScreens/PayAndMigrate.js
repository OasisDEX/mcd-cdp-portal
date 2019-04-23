import React, { useState } from 'react';
import {
  Text,
  Grid,
  Table,
  Button,
  Checkbox,
  Link,
  Flex,
  Tooltip,
  Card
} from '@makerdao/ui-components-core';
import CardTabs from '../CardTabs';

const Migrated = ({ onClose, dispatch }) => {
  return (
    <Grid gridRowGap="m">
      <Text.h2 textAlign="center">CDP Migration complete</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender">
        CDP #3228 has been successfully migrated to Multi-collateral Dai and the
        new CDP Portal.
      </Text.p>
      <Button
        my="xs"
        justifySelf="center"
        fontSize="s"
        py="xs"
        px="s"
        variant="secondary"
      >
        View transaction details
      </Button>
      <Card px="l" py="s" width="100%" maxWidth="400px" justifySelf="center">
        <Table width="100%">
          <tbody>
            <Table.tr>
              <Table.td>
                <Text color="darkPurple">CDP ID</Text>
              </Table.td>
              <Table.td textAlign="right">
                <Link fontWeight="medium">#3228</Link>
              </Table.td>
            </Table.tr>
            <Table.tr>
              <Table.td>
                <Text color="darkPurple">Payment: Stability Fee</Text>
              </Table.td>
              <Table.td textAlign="right">
                <Text fontWeight="medium" color="darkPurple">
                  23.32 DAI
                </Text>
              </Table.td>
            </Table.tr>
          </tbody>
        </Table>
      </Card>
      <Button
        mt="s"
        justifySelf="center"
        onClick={() => dispatch({ type: 'reset' })}
      >
        Migrate another CDP
      </Button>
      <Text.a
        textAlign="center"
        fontSize="l"
        color="steel"
        css={{ cursor: 'pointer' }}
        onClick={onClose}
      >
        Exit to CDP Portal
      </Text.a>
    </Grid>
  );
};

const Migrating = ({ onClose, dispatch, onNext }) => {
  // emulating time it takes for transaction to confirm, delete later
  setTimeout(onNext, 3000);

  return (
    <Grid gridRowGap="m">
      <Text.h2 textAlign="center">Your CDP is being migrated</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender">
        The estimated time is 8 minutes. You can safely leave this page and
        return.
      </Text.p>
      <Button
        justifySelf="center"
        fontSize="s"
        py="xs"
        px="s"
        variant="secondary"
      >
        View transaction details
      </Button>
      <Button justifySelf="center" onClick={() => dispatch({ type: 'reset' })}>
        Migrate another CDP
      </Button>
      <Text.a
        textAlign="center"
        fontSize="l"
        color="steel"
        css={{ cursor: 'pointer' }}
        onClick={onClose}
      >
        Exit to CDP Portal
      </Text.a>
    </Grid>
  );
};

const ConfirmMigrate = ({ onClose, dispatch, onNext }) => {
  const [hasReadTOS, setHasReadTOS] = useState(false);
  return (
    <Grid maxWidth="912px" gridRowGap="l">
      <Text.h2 textAlign="center">Confirm CDP Migration</Text.h2>
      <CardTabs headers={['Pay with Dai', 'Pay with MKR']}>
        <Grid gridRowGap="m" color="darkPurple" pt="2xs" pb="l" px="l">
          <Table width="100%">
            <Table.tbody>
              <Table.tr>
                <Table.td>
                  <Text>CDP ID</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">
                    <Link>3228</Link>
                  </Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text>Stability Fee Payment</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">23.32 DAI</Text>
                </Table.td>
              </Table.tr>
            </Table.tbody>
          </Table>
          <Flex alignItems="center">
            <Checkbox mr="s" fontSize="l" />
            <Text t="caption" color="steel">
              Trust this site with my DAI <Tooltip fontSize="l" />
            </Text>
          </Flex>
          <Flex alignItems="center">
            <Checkbox
              mr="s"
              fontSize="l"
              checked={hasReadTOS}
              onChange={evt => setHasReadTOS(evt.target.checked)}
            />
            <Text t="caption" color="steel">
              I have read and accept the <Link>Terms of Service</Link>.
            </Text>
          </Flex>
        </Grid>
        <Grid gridRowGap="m" color="darkPurple" pt="2xs" pb="l" px="l">
          <Table width="100%">
            <Table.tbody>
              <Table.tr>
                <Table.td>
                  <Text>CDP ID</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">
                    <Link>3228</Link>
                  </Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text>Stability Fee Payment</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">23.32 MKR</Text>
                </Table.td>
              </Table.tr>
            </Table.tbody>
          </Table>
          <Flex alignItems="center">
            <Checkbox
              mr="s"
              fontSize="l"
              checked={hasReadTOS}
              onChange={evt => setHasReadTOS(evt.target.checked)}
            />
            <Text t="caption" color="steel">
              I have read and accept the <Link>Terms of Service</Link>.
            </Text>
          </Flex>
        </Grid>
      </CardTabs>
      <Grid
        gridTemplateColumns="auto auto"
        justifyContent="center"
        gridColumnGap="m"
      >
        <Button
          justifySelf="center"
          variant="secondary-outline"
          onClick={() => dispatch({ type: 'decrement-step' })}
        >
          Cancel
        </Button>
        <Button justifySelf="center" disabled={!hasReadTOS} onClick={onNext}>
          Pay and Migrate
        </Button>
      </Grid>
    </Grid>
  );
};

export default props => {
  // replace with proper state logic
  const [step, setStep] = useState(0);

  if (step === 0)
    return <ConfirmMigrate {...props} onNext={() => setStep(1)} />;
  if (step === 1) return <Migrating {...props} onNext={() => setStep(2)} />;
  if (step === 2) return <Migrated {...props} />;
};
