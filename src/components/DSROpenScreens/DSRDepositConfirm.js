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
import lang from 'languages';
import { etherscanLink } from 'utils/ethereum';
import { networkIdToName } from 'utils/network';
import ScreenFooter from './ScreenFooter';
import ScreenHeader from './ScreenHeader';
import { prettifyNumber } from 'utils/ui';

import { ReactComponent as ExternalLinkIcon } from 'images/external-link.svg';
import { ReactComponent as SpaceshipIllustration } from 'images/spaceship.svg';

const DSRDepositConfirmSummary = ({ capturedDispatch }) => {
  const [hasReadTOS, setHasReadTOS] = useState(false);

  const ph = '123';

  const rows = [[lang.verbs.depositing, `${prettifyNumber(ph)} DAI`]];
  return (
    <Box
      maxWidth="1040px"
      css={`
        margin: 0 auto;
      `}
    >
      <ScreenHeader title={lang.cdp_create.confirm_title} />
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
              <Link>{lang.terms_of_service}</Link>
            )}
          </Text>
        </Grid>
      </Card>
      <ScreenFooter
        canProgress={hasReadTOS}
        onNext={() => capturedDispatch({ type: 'increment-step' })}
        onBack={() => capturedDispatch({ type: 'decrement-step' })}
        continueText={lang.actions.create_cdp}
      />
    </Box>
  );
};

const DSRDepositWait = ({ hash, onClose }) => {
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
          ? `${seconds} seconds`
          : `${minutes} minute${minutes === 1 ? '' : 's'}`;

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
        title={lang.cdp_create.confirmed_title}
        text={lang.formatString(lang.cdp_create.confirmed_text, waitTime)}
      />
      <Flex my="l" justifyContent="center">
        <Grid gridRowGap="s">
          <Box m="auto">
            <SpaceshipIllustration />
          </Box>
          <Box my="l" textAlign="center">
            {isTestchain ? (
              <Grid gridRowGap="s">
                <Text>Transaction hash</Text>
                <Text>{hash}</Text>
              </Grid>
            ) : (
              <Link
                target="_blank"
                href={etherscanLink(hash, networkIdToName(networkId))}
              >
                View transaction details <ExternalLinkIcon />
              </Link>
            )}
          </Box>
          <Flex textAlign="center" justifyContent="center">
            <Button onClick={onClose} width="145px">
              Exit
            </Button>
          </Flex>
        </Grid>
      </Flex>
    </Box>
  );
};

const DSRDepositConfirm = ({ dispatch, cdpParams, selectedIlk, onClose }) => {
  const { maker, checkForNewCdps, newTxListener } = useMaker();

  const [depositDaiTxHash, setDepositDaiTxHash] = useState(null);

  async function capturedDispatch(payload) {
    const { type } = payload;
    if (type !== 'increment-step') return dispatch(payload);

    const mockAmount = '4';
    const txObject = maker.service('mcd:savings').join(mockAmount);

    newTxListener(txObject, lang.transactions.create_cdp);

    const txMgr = maker.service('transactionManager');
    txMgr.listen(txObject, {
      pending: tx => setDepositDaiTxHash(tx.hash),
      confirmed: () => checkForNewCdps()
    });
    await txMgr.confirm(txObject, 1);
  }

  //todo
  if (depositDaiTxHash)
    return <DSRDepositWait hash={depositDaiTxHash} onClose={onClose} />;

  return (
    <DSRDepositConfirmSummary
      cdpParams={cdpParams}
      selectedIlk={selectedIlk}
      capturedDispatch={capturedDispatch}
    />
  );
};

export default DSRDepositConfirm;
