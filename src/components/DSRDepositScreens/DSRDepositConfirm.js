import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Text,
  Flex,
  Card,
  Checkbox,
  Button,
  Link
} from '@makerdao/ui-components-core';
import useMaker from 'hooks/useMaker';
import useLanguage from 'hooks/useLanguage';
import { etherscanLink } from 'utils/ethereum';
import { networkIdToName } from 'utils/network';
import ScreenFooter from '../ScreenFooter';
import ScreenHeader from '../ScreenHeader';
import { prettifyNumber } from 'utils/ui';
import { TxLifecycle } from 'utils/constants';
import { DAI } from '@makerdao/dai-plugin-mcd';

import { ReactComponent as ExternalLinkIcon } from 'images/external-link.svg';
import { ReactComponent as SpaceshipIllustration } from 'images/spaceship.svg';

const DSRDepositConfirmSummary = ({
  onClose,
  depositAmount,
  capturedDispatch
}) => {
  const { lang } = useLanguage();
  const [hasReadTOS, setHasReadTOS] = useState(false);

  const rows = [
    [lang.save.deposit_amount, `${prettifyNumber(depositAmount)} DAI`]
  ];
  return (
    <Box
      maxWidth="1040px"
      css={`
        margin: 0 auto;
      `}
    >
      <ScreenHeader
        title={lang.dsr_deposit.confirm_title}
        text={lang.save.deposit_dai_subheading}
      />
      <Card py={{ s: 'm', m: 'l' }} px={{ s: 'm', m: 'xl' }} my="l">
        <Grid>
          {rows.map(([title, value], index) => {
            return (
              <Grid
                key={title + value}
                mt={!!index && 's'}
                pt={!!index && 's'}
                gridTemplateColumns="5fr 1fr"
                justifyItems="start"
                borderTop={index !== 0 ? '1px solid' : null}
                color="grey.200"
              >
                <Text>{title}</Text>
                <Text
                  fontWeight="bold"
                  css="white-space: nowrap"
                  textAlign={{ s: 'right', m: 'left' }}
                >
                  {value}
                </Text>
              </Grid>
            );
          })}
        </Grid>
        <Grid
          justifyContent="center"
          mt="l"
          alignItems="center"
          gridColumnGap="xs"
          gridTemplateColumns="auto auto"
        >
          <Checkbox
            checked={hasReadTOS}
            onChange={() => setHasReadTOS(state => !state)}
          />
          <Text color="grey.500">
            {lang.formatString(
              lang.terms_of_service_text,
              <Link href="/terms" target="_blank">
                {lang.terms_of_service}
              </Link>
            )}
          </Text>
        </Grid>
      </Card>
      <ScreenFooter
        canProgress={hasReadTOS}
        onNext={() => capturedDispatch({ type: 'increment-step' })}
        onBack={onClose}
        continueText={lang.actions.deposit}
        secondaryButtonText={lang.actions.skip}
      />
    </Box>
  );
};

const DSRDepositWait = ({ hash, onClose, txState }) => {
  const { lang } = useLanguage();
  const { maker } = useMaker();
  const [waitTime, setWaitTime] = useState('8 minutes');

  const networkId = maker.service('web3').networkId();
  const isTestchain = ![1, 42].includes(networkId);
  useEffect(() => {
    (async () => {
      // this is the default transaction speed
      const waitTime = await maker.service('gas').getWaitTime('fast');
      const minutes = Math.round(waitTime);
      const seconds = Math.round(waitTime * 6) * 10;

      const waitTimeText =
        waitTime < 1
          ? `${seconds} ${lang.cdp_create.seconds_wait_time}`
          : `${minutes} ${
              minutes === 1
                ? lang.cdp_create.minutes_wait_time_singular
                : lang.minutes_wait_time_plural
            }`;

      setWaitTime(waitTimeText);
    })();
  });

  return (
    <Box
      maxWidth="1040px"
      css={`
        margin: 0 auto;
      `}
    >
      <ScreenHeader
        title={
          txState === TxLifecycle.CONFIRMED
            ? lang.dsr_deposit.post_confirmed_title
            : lang.dsr_deposit.confirmed_title
        }
        text={
          txState === TxLifecycle.CONFIRMED
            ? lang.cdp_create.post_confirmed_text
            : lang.formatString(lang.cdp_create.confirmed_text, waitTime)
        }
      />
      <Flex my="l" justifyContent="center">
        <Grid gridRowGap="s">
          <Box m="auto">
            <SpaceshipIllustration />
          </Box>
          <Box my="l" textAlign="center">
            {isTestchain ? (
              <Grid gridRowGap="s">
                <Text>{lang.cdp_create.tx_hash}</Text>
                <Text>{hash}</Text>
              </Grid>
            ) : (
              <Link
                target="_blank"
                href={etherscanLink(hash, networkIdToName(networkId))}
              >
                {lang.cdp_create.view_tx_details} <ExternalLinkIcon />
              </Link>
            )}
          </Box>
          <Flex textAlign="center" justifyContent="center">
            <Button onClick={onClose} width="145px">
              {lang.exit}
            </Button>
          </Flex>
        </Grid>
      </Flex>
    </Box>
  );
};

const DSRDepositConfirm = ({ dispatch, onClose, depositAmount, txState }) => {
  const { maker } = useMaker();

  const [depositDaiTxHash, setDepositDaiTxHash] = useState(null);

  async function capturedDispatch(payload) {
    const { type } = payload;
    if (type !== 'increment-step') return dispatch(payload);

    const txObject = maker.service('mcd:savings').join(DAI(depositAmount));

    const txMgr = maker.service('transactionManager');
    txMgr.listen(txObject, {
      pending: tx => setDepositDaiTxHash(tx.hash),
      confirmed: () => dispatch({ type: 'transaction-confirmed' })
    });
    await txMgr.confirm(txObject, 1);
  }

  if (depositDaiTxHash)
    return (
      <DSRDepositWait
        hash={depositDaiTxHash}
        onClose={onClose}
        txState={txState}
      />
    );

  return (
    <DSRDepositConfirmSummary
      capturedDispatch={capturedDispatch}
      depositAmount={depositAmount}
      onClose={onClose}
    />
  );
};

export default DSRDepositConfirm;
