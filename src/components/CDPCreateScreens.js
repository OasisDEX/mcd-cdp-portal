import React, { Fragment } from 'react';
import {
  Box,
  Button,
  Grid,
  Text,
  Input,
  Table,
  Flex,
  Card,
  Checkbox,
  Link
} from '@makerdao/ui-components-core';
import { TextBlock } from 'components/Typography';
import TwoColumnCardsLayout from 'layouts/TwoColumnCardsLayout';
import { Pill } from 'components/Primitives';
import { connect } from 'react-redux';
import { getIlkData } from 'reducers/network/cdpTypes';
import { prettifyNumber } from 'utils/ui';
import LoadingLayout from 'layouts/LoadingLayout';
import { getColor } from 'styles/theme';
import useMaker from 'hooks/useMaker';
import lang from 'languages';
import { MAX_UINT_BN } from 'utils/units';
import { MDAI } from '@makerdao/dai-plugin-mcd';

function mapStateToProps(state, { ilk }) {
  return {
    ilk: {
      ...ilk,
      data: getIlkData(state, ilk.slug)
    }
  };
}

const ScreenHeader = ({ title, text }) => {
  return (
    <Box textAlign="center" pt="m">
      <Box pb="m">
        <TextBlock t="headingL" fontWeight="medium">
          {title}
        </TextBlock>
      </Box>
      <TextBlock t="textL" color="gray2">
        {text}
      </TextBlock>
    </Box>
  );
};

const ScreenFooter = ({
  dispatch,
  loading,
  canProgress = true,
  continueText = lang.actions.continue
} = {}) => {
  return (
    <Flex textAlign="center" justifyContent="center">
      <Button
        width="110px"
        variant="secondary-outline"
        mx="xs"
        onClick={() => dispatch({ type: 'decrement-step' })}
      >
        {lang.actions.back}
      </Button>
      <Button
        disabled={!canProgress}
        loading={loading}
        width="145px"
        mx="xs"
        onClick={() => dispatch({ type: 'increment-step' })}
      >
        {continueText}
      </Button>
    </Flex>
  );
};

const CDPCreateSelectCollateralSidebar = () => (
  <Box p="l">
    <TextBlock t="headingS" fontWeight="medium">
      {lang.risk_parameters}
    </TextBlock>
    <Box mt="m">
      {[
        [lang.stability_fee, lang.cdp_create.stability_fee_description],
        [lang.liquidation_ratio, lang.cdp_create.liquidation_ratio_description],
        [
          lang.liquidation_penalty,
          lang.cdp_create.liquidation_penalty_description
        ]
      ].map(([title, text]) => (
        <Grid mb="m" key={title} gridRowGap="xs">
          <TextBlock t="textM" fontWeight="medium">
            {title}
          </TextBlock>
          <TextBlock t="textS" color="black3">
            {text}
          </TextBlock>
        </Grid>
      ))}
    </Box>
  </Box>
);

function IlkTableRowView({ ilk, checked, dispatch }) {
  const { maker } = useMaker();
  const [userGemBalance, setUserGemBalance] = React.useState(null);

  async function checkGemBalance() {
    setUserGemBalance(await maker.getToken(ilk.gem).balance());
  }

  React.useEffect(() => {
    checkGemBalance();
  }, []);

  return (
    <tbody
      css={`
        border-bottom: 1px solid;
        border-bottom-color: ${({ theme }) => theme.colors.grayLight6};
      `}
    >
      <tr>
        <td>
          <Checkbox
            checked={checked}
            onChange={() =>
              dispatch({
                type: 'set-ilk',
                payload: {
                  key: ilk.key,
                  gemBalance: userGemBalance.toNumber(),
                  ilkData: ilk.data
                }
              })
            }
            mr="xs"
          />
        </td>
        <td>{ilk.symbol}</td>
        <td>{ilk.data.rate} %</td>
        <td>{ilk.data.liquidationRatio} %</td>
        <td>{ilk.data.liquidationPenalty} %</td>
        <td>{prettifyNumber(userGemBalance)}</td>
      </tr>
    </tbody>
  );
}
const IlkTableRow = connect(
  mapStateToProps,
  {}
)(IlkTableRowView);

function OpenCDPForm({ selectedIlk, cdpParams, handleInputChange }) {
  const userHasSufficientGemBalance =
    parseFloat(selectedIlk.userGemBalance) >= parseFloat(cdpParams.gemsToLock);

  const fields = [
    [
      lang.formatString(
        lang.cdp_create.deposit_form_field1_title,
        selectedIlk.key
      ),
      lang.formatString(
        lang.cdp_create.deposit_form_field1_text,
        selectedIlk.key
      ),
      <Input
        key="collinput"
        name="gemsToLock"
        after={selectedIlk.key}
        type="number"
        value={cdpParams.gemsToLock}
        onChange={handleInputChange}
        width={300}
        errorMessage={
          userHasSufficientGemBalance || !cdpParams.gemsToLock
            ? null
            : lang.formatString(
                lang.cdp_create.insufficient_ilk_balance,
                selectedIlk.key
              )
        }
      />,
      <Box key="ba">
        <Text t="smallCaps" color="gray2" fontWeight="medium">
          {lang.your_balance}{' '}
        </Text>
        <Text
          t="textS"
          onClick={() => {
            handleInputChange({
              target: {
                name: 'gemsToLock',
                value: selectedIlk.userGemBalance
              }
            });
          }}
        >
          {selectedIlk.userGemBalance} {selectedIlk.key}
        </Text>
      </Box>
    ],
    [
      lang.cdp_create.deposit_form_field2_title,
      <Fragment key="ratioinfo">
        {lang.formatString(
          lang.cdp_create.deposit_form_field2_text,
          <Pill bg="yellowPastel" display="inline-block">
            <Text t="smallCaps" color="yellowDark" fontWeight="bold">
              Moderate
            </Text>
          </Pill>
        )}
      </Fragment>,
      <Input
        key="ratioinput"
        name="targetCollateralizationRatio"
        after="%"
        type="number"
        width={230}
        value={cdpParams.targetCollateralizationRatio}
        onChange={handleInputChange}
      />,
      <Box key="ratioafter">
        <Text t="smallCaps" color="gray2" fontWeight="medium">
          {lang.cdp_create.deposit_form_field2_after}{' '}
        </Text>
        <Text
          t="textS"
          onClick={() => {
            handleInputChange({
              target: {
                name: 'targetCollateralizationRatio',
                value: 200
              }
            });
          }}
        >
          200%
        </Text>
      </Box>
    ],
    [
      lang.cdp_create.deposit_form_field3_title,
      lang.cdp_create.deposit_form_field3_text,
      <Input
        key="daiToDraw"
        name="daiToDraw"
        after="DAI"
        width="250px"
        type="number"
        value={cdpParams.daiToDraw}
        onChange={handleInputChange}
      />,
      <Grid gridRowGap="xs" key="keytodrawinfo">
        <Text t="smallCaps" color="gray2" fontWeight="medium">
          {lang.cdp_create.deposit_form_field3_after1}{' '}
          <Text t="textS">200%</Text>
        </Text>
        <Text t="smallCaps" color="gray2" fontWeight="medium">
          {lang.cdp_create.deposit_form_field3_after2}{' '}
          <Text t="textS">200%</Text>
        </Text>
      </Grid>
    ]
  ];

  return (
    <Grid gridRowGap="l" p="l" maxWidth="100%">
      <Grid
        gridTemplateColumns="auto"
        gridRowGap="m"
        gridColumnGap="m"
        alignItems="center"
      >
        {fields.map(([title, text, input, renderAfter]) => {
          return (
            <Grid gridRowGap="xs" key={title}>
              <TextBlock t="headingS" fontWeight="medium">
                {title}
              </TextBlock>
              <TextBlock t="textS" color="gray2">
                {text}
              </TextBlock>
              <Box>{input}</Box>
              {renderAfter}
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
}

function cdpParamsAreValid({ gemsToLock, daiToDraw }, userGemBalance) {
  if (parseFloat(gemsToLock) > parseFloat(userGemBalance)) return false;
  return !!gemsToLock && !!daiToDraw;
}

const CDPCreateSelectCollateral = ({
  selectedIlk,
  dispatch,
  actionableIlks
}) => {
  return (
    <Box
      maxWidth="1040px"
      css={`
        margin: 0 auto;
      `}
    >
      <ScreenHeader
        title={lang.cdp_create.select_title}
        text={lang.cdp_create.select_text}
      />
      <Box my="l">
        <TwoColumnCardsLayout
          ratio={[6, 3]}
          mainContent={
            <Flex justifyContent="center" p="l">
              <Table width="100%">
                <thead>
                  <tr>
                    <th />
                    {[
                      lang.collateral_type,
                      lang.stability_fee,
                      lang.liquidation_ratio_shortened,
                      lang.liquidation_penalty_shortened,
                      lang.your_balance
                    ].map(t => (
                      <th key={t}>{t}</th>
                    ))}
                  </tr>
                </thead>
                {actionableIlks.map(({ slug, key, gem, symbol }) => (
                  <IlkTableRow
                    key={key}
                    checked={key === selectedIlk.key}
                    dispatch={dispatch}
                    ilk={{ symbol, slug, key, gem }}
                  />
                ))}
              </Table>
            </Flex>
          }
          sideContent={<CDPCreateSelectCollateralSidebar />}
        />
      </Box>
      <ScreenFooter dispatch={dispatch} canProgress={!!selectedIlk.key} />
    </Box>
  );
};

const CDPCreateDepositSidebar = ({ selectedIlk }) => {
  const { liquidationPenalty, liquidationRatio, key } = selectedIlk.ilkData;
  return (
    <Fragment>
      <Card p="l">
        <TextBlock t="headingS" fontWeight="medium">
          {key} Risk Parameters
        </TextBlock>
        <Box mt="m">
          {[
            [lang.cdp_page.stability_fee, '2.50%'],
            [lang.cdp_page.liquidation_ratio, `${liquidationRatio}%`],
            [lang.cdp_page.liquidation_penalty, `${liquidationPenalty}%`]
          ].map(([title, value]) => (
            <Grid mt="m" gridRowGap="xs" key={title}>
              <TextBlock t="textM" fontWeight="medium">
                {title}
              </TextBlock>
              <TextBlock t="headingS" fontWeight="medium">
                {value}
              </TextBlock>
            </Grid>
          ))}
        </Box>
      </Card>
      {[
        [lang.collateralization, '0%'], // TODO
        [lang.collateralization_ratio, '$0']
      ].map(([title, value]) => (
        <Card mt="m" p="l" key="title">
          <Grid gridRowGap="xs">
            <TextBlock t="headingS" fontWeight="medium">
              {title}
            </TextBlock>
            <TextBlock t="headingL">{value}</TextBlock>
          </Grid>
        </Card>
      ))}
    </Fragment>
  );
};
const CDPCreateDeposit = ({ selectedIlk, cdpParams, dispatch }) => {
  console.log(selectedIlk, cdpParams, 'here');

  function handleInputChange({ target }) {
    dispatch({
      type: `form/set-${target.name}`,
      payload: { value: target.value }
    });
  }
  const { ilkData } = selectedIlk;
  console.log(ilkData.feedValueUSD ? ilkData.feedValueUSD : null);

  return (
    <Box
      maxWidth="1040px"
      css={`
        margin: 0 auto;
      `}
    >
      <ScreenHeader
        title={lang.formatString(
          lang.cdp_create.deposit_title,
          selectedIlk.key
        )}
        text={lang.cdp_create.deposit_text}
      />
      <Box my="l">
        <TwoColumnCardsLayout
          mainContent={
            <OpenCDPForm
              cdpParams={cdpParams}
              handleInputChange={handleInputChange}
              selectedIlk={selectedIlk}
            />
          }
          ratio={[4, 2]}
          sideContent={<CDPCreateDepositSidebar selectedIlk={selectedIlk} />}
          SidebarComponent={Box}
        />
      </Box>
      <ScreenFooter
        dispatch={dispatch}
        canProgress={cdpParamsAreValid(cdpParams, selectedIlk.userBalance)}
      />
    </Box>
  );
};

// const CDPCreateNoProxy = () => {
//   return (
//     <Box>
//       <ScreenHeader
//         title={lang.cdp_create.proxy_title}
//         text={lang.cdp_create.proxy_text}
//       />
//     </Box>
//   );
// };

const CDPCreateConfirmSummary = ({
  cdpParams,
  selectedIlk,
  capturedDispatch
}) => {
  const { liquidationPenalty, liquidationRatio } = selectedIlk.ilkData;

  const rows = [
    [lang.verbs.depositing, `${cdpParams.gemsToLock} ${selectedIlk.key}`],
    [lang.verbs.generating, `${cdpParams.daiToDraw} DAI`],
    [lang.collateralization_ratio, `${cdpParams.daiToDraw}%`],
    [lang.liquidation_ratio, `${liquidationRatio}%`],
    [lang.liquidation_price, `$${cdpParams.daiToDraw}`],
    [lang.liquidation_penalty, `${liquidationPenalty}%`],
    [lang.stability_fee, '2.5%']
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
              <Checkbox checked={false} onChange={() => {}} mr="xs" />
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
    console.log(cdp, 'hereee');
    setOpeningCDP(false);
    setCdpCreated(cdp);
  }

  async function ensureProxyWithGemApprovals() {
    const proxyAddress = await maker.service('proxy').ensureProxy();
    const gemToken = maker.getToken(selectedIlk.ilkData.gem);
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

export { CDPCreateSelectCollateral, CDPCreateConfirmCDP, CDPCreateDeposit };
