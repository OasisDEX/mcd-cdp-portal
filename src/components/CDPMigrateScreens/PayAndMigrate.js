import React, { useState } from 'react';
import useLanguage from 'hooks/useLanguage';
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
  const { lang } = useLanguage();

  return (
    <Grid gridRowGap="m">
      <Text.h2 textAlign="center">
        {lang.cdp_migrate.migrate_complete_header}
      </Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        {lang.formatString(lang.cdp_migrate.migrate_complete_text, '3228')}
      </Text.p>
      <Button
        my="xs"
        justifySelf="center"
        fontSize="s"
        py="xs"
        px="s"
        variant="secondary"
      >
        {lang.cdp_migrate.view_transaction_details}
      </Button>
      <Card px="l" py="s" width="100%" maxWidth="400px" justifySelf="center">
        <Table width="100%">
          <tbody>
            <Table.tr>
              <Table.td>
                <Text color="darkPurple">{lang.cdp_id}</Text>
              </Table.td>
              <Table.td textAlign="right">
                <Link fontWeight="medium">#3228</Link>
              </Table.td>
            </Table.tr>
            <Table.tr>
              <Table.td>
                <Text color="darkPurple">
                  {lang.cdp_page.payment}: {lang.stability_fee}
                </Text>
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
        {lang.cdp_migrate.migrate_another_cdp}
      </Button>
      <Text.a
        textAlign="center"
        fontSize="l"
        color="steel"
        css={{ cursor: 'pointer' }}
        onClick={onClose}
      >
        {lang.cdp_migrate.exit_to_cdp_portal}
      </Text.a>
    </Grid>
  );
};

const Migrating = ({ onClose, dispatch, onNext }) => {
  const { lang } = useLanguage();

  // emulating time it takes for transaction to confirm, delete later
  setTimeout(onNext, 3000);

  return (
    <Grid gridRowGap="m">
      <Text.h2 textAlign="center">
        {lang.cdp_migrate.migrate_in_progress_header}
      </Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender">
        {lang.cdp_migrate.migrate_in_progress_text}
      </Text.p>
      <Button
        justifySelf="center"
        fontSize="s"
        py="xs"
        px="s"
        variant="secondary"
      >
        {lang.cdp_migrate.view_transaction_details}
      </Button>
      <Button justifySelf="center" onClick={() => dispatch({ type: 'reset' })}>
        {lang.cdp_migrate.migrate_another_cdp}
      </Button>
      <Text.a
        textAlign="center"
        fontSize="l"
        color="steel"
        css={{ cursor: 'pointer' }}
        onClick={onClose}
      >
        {lang.cdp_migrate.exit_to_cdp_portal}
      </Text.a>
    </Grid>
  );
};

const ConfirmMigrate = ({ onClose, dispatch, onNext }) => {
  const { lang } = useLanguage();
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
                  <Text>{lang.cdp_id}</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">
                    <Link>3228</Link>
                  </Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text>
                    {lang.stability_fee} {lang.cdp_migrate.payment}
                  </Text>
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
              {lang.cdp_migrate.trust_site_with_dai} <Tooltip fontSize="l" />
            </Text>
          </Flex>
          <Grid alignItems="center" gridTemplateColumns="auto 1fr">
            <Checkbox
              mr="s"
              fontSize="l"
              checked={hasReadTOS}
              onChange={evt => setHasReadTOS(evt.target.checked)}
            />
            <Text t="caption" color="steel">
              {lang.formatString(
                lang.terms_of_service_text,
                <Link>{lang.terms_of_service}</Link>
              )}
            </Text>
          </Grid>
        </Grid>
        <Grid gridRowGap="m" color="darkPurple" pt="2xs" pb="l" px="l">
          <Table width="100%">
            <Table.tbody>
              <Table.tr>
                <Table.td>
                  <Text>{lang.cdp_id}</Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">
                    <Link>3228</Link>
                  </Text>
                </Table.td>
              </Table.tr>
              <Table.tr>
                <Table.td>
                  <Text>
                    {lang.stability_fee} {lang.cdp_migrate.payment}
                  </Text>
                </Table.td>
                <Table.td textAlign="right">
                  <Text fontWeight="medium">23.32 MKR</Text>
                </Table.td>
              </Table.tr>
            </Table.tbody>
          </Table>
          <Grid alignItems="center" gridTemplateColumns="auto 1fr">
            <Checkbox
              mr="s"
              fontSize="l"
              checked={hasReadTOS}
              onChange={evt => setHasReadTOS(evt.target.checked)}
            />
            <Text t="caption" color="steel">
              {lang.formatString(
                lang.terms_of_service_text,
                <Link>{lang.terms_of_service}</Link>
              )}
            </Text>
          </Grid>
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
          {lang.cancel}
        </Button>
        <Button justifySelf="center" disabled={!hasReadTOS} onClick={onNext}>
          {lang.cdp_migrate.pay_and_migrate}
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
