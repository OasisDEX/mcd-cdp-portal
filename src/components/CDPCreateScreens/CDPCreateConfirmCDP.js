import React from 'react';
import {
  Box,
  Grid,
  Text,
  Flex,
  Card,
  Checkbox,
  Link
} from '@makerdao/ui-components-core';
import { TextBlock } from 'components/Typography';
import LoadingLayout from 'layouts/LoadingLayout';
import { getColor } from 'styles/theme';
import useMaker from 'hooks/useMaker';
import lang from 'languages';
import { MAX_UINT_BN } from 'utils/units';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import { calcCDPParams } from 'utils/ui';
import ScreenFooter from './ScreenFooter';
import ScreenHeader from './ScreenHeader';

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
    [lang.collateralization_ratio, `${collateralizationRatio}%`],
    [lang.liquidation_ratio, `${liquidationRatio}%`],
    [lang.liquidation_price, `$${liquidationPrice}`],
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
      <Box my="l">
        <Card p="l" px="xl">
          <Grid>
            {rows.map(([title, value], index) => {
              return (
                <Grid
                  key={title + value}
                  mt={!!index && 's'}
                  pt={!!index && 's'}
                  gridTemplateColumns="5fr 1fr"
                  justifyItems="start"
                  css={{
                    [index !== 0 ? 'borderTop' : '']: '1px solid',
                    borderColor: getColor('grayLight6')
                  }}
                >
                  <Text>{title}</Text>
                  <Text fontWeight="bold">{value}</Text>
                </Grid>
              );
            })}
          </Grid>
          <Flex>
            <Box m="auto" mt="l">
              <Checkbox
                checked={hasReadTOS}
                onChange={() => setHasReadTOS(state => !state)}
                mr="xs"
              />
              <Text color="gray2">
                {lang.formatString(
                  lang.terms_of_service_text,
                  <Link color="greenPastel">{lang.terms_of_service}</Link>
                )}
              </Text>
            </Box>
          </Flex>
        </Card>
      </Box>
      <ScreenFooter
        canProgress={hasReadTOS}
        dispatch={capturedDispatch}
        continueText={lang.actions.create_cdp}
      />
    </Box>
  );
};

const CDPCreateConfirmed = ({ data }) => {
  const { hash } = data;
  const emoji = '🤑';
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
          <TextBlock textAlign="center" fontSize="70px">
            {emoji}
          </TextBlock>
          <TextBlock t="headingS" textAlign="center">
            Transaction
          </TextBlock>
          <Box>
            <Link t="textS" href={`https://kovan.etherscan.io/tx/${hash}`}>
              {hash}
            </Link>
          </Box>
        </Grid>
      </Flex>
    </Box>
  );
};

const CDPCreateConfirmCDP = ({ dispatch, cdpParams, selectedIlk }) => {
  const { maker } = useMaker();
  const { gemsToLock, daiToDraw } = cdpParams;

  const [canCreateCDP, setCanCreateCDP] = React.useState(false);
  const [openingCDP, setOpeningCDP] = React.useState(false);
  const [cdpCreatedInfo, setCdpCreated] = React.useState(false);

  async function capturedDispatch(payload) {
    const { type } = payload;
    if (type !== 'increment-step') return dispatch(payload);
    setOpeningCDP(true);

    const { currency, id, ilk } = await maker
      .service('mcd:cdpManager')
      .open(selectedIlk.key);
    const cdp = await maker
      .service('mcd:cdpManager')
      .lockAndDraw(id, ilk, currency(gemsToLock), MDAI(daiToDraw));
    setOpeningCDP(false);
    setCdpCreated(cdp);
  }

  async function ensureProxyWithGemApprovals() {
    const proxyAddress = await maker.service('proxy').ensureProxy();
    const gemToken = maker.getToken(selectedIlk.data.gem);
    const gemAllowanceSet = (await gemToken.allowance(
      maker.currentAddress(),
      proxyAddress
    )).eq(MAX_UINT_BN);

    if (!gemAllowanceSet) await gemToken.approveUnlimited(proxyAddress);

    setCanCreateCDP(true);
  }

  React.useEffect(() => {
    ensureProxyWithGemApprovals();
  }, []);

  if (!canCreateCDP || openingCDP)
    return <LoadingLayout background="#F6F8F9" />;

  if (cdpCreatedInfo) return <CDPCreateConfirmed data={cdpCreatedInfo} />;

  return (
    <CDPCreateConfirmSummary
      cdpParams={cdpParams}
      selectedIlk={selectedIlk}
      capturedDispatch={capturedDispatch}
    />
  );
};

export default CDPCreateConfirmCDP;
