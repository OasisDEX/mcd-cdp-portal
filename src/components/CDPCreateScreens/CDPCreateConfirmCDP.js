import React from 'react';
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
import LoadingLayout from 'layouts/LoadingLayout';
import useMaker from 'hooks/useMaker';
import lang from 'languages';
import { MAX_UINT_BN } from 'utils/units';
import { calcCDPParams } from 'utils/cdp';
import { formatCollateralizationRatio } from 'utils/ui';
import { etherscanLink } from 'utils/ethereum';
import { networkIdToName } from 'utils/network';
import ScreenFooter from './ScreenFooter';
import ScreenHeader from './ScreenHeader';
import { ReactComponent as ExternalLinkIcon } from 'images/external-link.svg';
import { ReactComponent as SpaceshipIllustration } from 'images/spaceship.svg';

const CDPCreateConfirmSummary = ({
  cdpParams,
  selectedIlk,
  capturedDispatch
}) => {
  const [hasReadTOS, setHasReadTOS] = React.useState(false);

  const { liquidationPenalty, liquidationRatio, rate } = selectedIlk.data;
  const { gemsToLock, daiToDraw } = cdpParams;
  const { liquidationPrice, collateralizationRatio } = calcCDPParams({
    ilkData: selectedIlk.data,
    gemsToLock,
    daiToDraw
  });

  const rows = [
    [lang.verbs.depositing, `${cdpParams.gemsToLock} ${selectedIlk.key}`],
    [lang.verbs.generating, `${cdpParams.daiToDraw} DAI`],
    [
      lang.collateralization_ratio,
      formatCollateralizationRatio(collateralizationRatio)
    ],
    [lang.liquidation_ratio, `${liquidationRatio}%`],
    [lang.liquidation_price, `$${liquidationPrice.toFixed(2)}`],
    [lang.liquidation_penalty, `${liquidationPenalty}%`],
    [lang.stability_fee, `${rate}%`]
  ];
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
                <Text fontWeight="bold" css="white-space: nowrap">
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
        dispatch={capturedDispatch}
        continueText={lang.actions.create_cdp}
      />
    </Box>
  );
};

const CDPCreateConfirmed = ({ hash, onClose }) => {
  const { maker } = useMaker();

  const networkId = maker.service('web3').networkId();
  const isTestchain = ![1, 42].includes(networkId);

  return (
    <Box
      maxWidth="1040px"
      css={`
        margin: 0 auto;
      `}
    >
      <ScreenHeader
        title={lang.cdp_create.confirmed_title}
        text={lang.cdp_create.confirmed_text}
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

const CDPCreateConfirmCDP = ({ dispatch, cdpParams, selectedIlk, onClose }) => {
  const { maker, newTxListener } = useMaker();

  const { gemsToLock, daiToDraw } = cdpParams;

  const [canCreateCDP, setCanCreateCDP] = React.useState(false);
  const [openCDPTxHash, setOpenCDPTxHash] = React.useState(null);

  async function capturedDispatch(payload) {
    const { type } = payload;
    if (type !== 'increment-step') return dispatch(payload);

    const txObject = maker
      .service('mcd:cdpManager')
      .openLockAndDraw(
        selectedIlk.key,
        selectedIlk.currency(gemsToLock),
        daiToDraw
      );

    newTxListener(txObject, 'Creating CDP');

    maker.service('transactionManager').listen(txObject, {
      pending: tx => setOpenCDPTxHash(tx.hash)
    });
  }

  async function ensureProxyWithGemApprovals() {
    try {
      const proxyAddress = await maker.service('proxy').ensureProxy();
      if (selectedIlk.currency.symbol !== 'ETH') {
        const gemToken = maker.getToken(selectedIlk.currency.symbol);
        const gemAllowanceSet = (await gemToken.allowance(
          maker.currentAddress(),
          proxyAddress
        )).eq(MAX_UINT_BN);

        if (!gemAllowanceSet) await gemToken.approveUnlimited(proxyAddress);
      }
      setCanCreateCDP(true);
    } catch (err) {
      console.error(err);
    }
  }

  React.useEffect(() => {
    ensureProxyWithGemApprovals();
  }, []);

  if (!canCreateCDP) return <LoadingLayout background="#F6F8F9" />;

  if (openCDPTxHash)
    return <CDPCreateConfirmed hash={openCDPTxHash} onClose={onClose} />;

  return (
    <CDPCreateConfirmSummary
      cdpParams={cdpParams}
      selectedIlk={selectedIlk}
      capturedDispatch={capturedDispatch}
    />
  );
};

export default CDPCreateConfirmCDP;
