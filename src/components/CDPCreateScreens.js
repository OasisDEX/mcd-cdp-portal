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
import { connect } from 'react-redux';
import { getIlkData } from 'reducers/network/cdpTypes';
import { prettifyNumber } from 'utils/ui';
import LoadingLayout from 'layouts/LoadingLayout';
import { getColor } from 'styles/theme';
import useMaker from 'hooks/useMaker';
import lang from 'languages';
import { MAX_UINT_BN } from 'utils/units';
import { MDAI } from '@makerdao/dai-plugin-mcd';

function calcCDPParams({ ilkData, gemsToLock, daiToDraw }) {
  const { liquidationRatio } = ilkData;
  const collateralizationRatio =
    calcCollateralizationRatio({
      deposited: parseFloat(gemsToLock),
      price: getUsdPrice(ilkData),
      generated: parseFloat(daiToDraw)
    }) || 0;
  const liquidationPrice =
    calcLiquidationPrice({
      liquidationRatio,
      deposited: parseFloat(gemsToLock),
      generated: parseFloat(daiToDraw),
      price: getUsdPrice(ilkData)
    }) || 0;
  const daiAvailable = calcDaiAvailable({
    liquidationRatio,
    deposited: parseFloat(gemsToLock),
    generated: parseFloat(daiToDraw),
    price: getUsdPrice(ilkData)
  });

  return {
    collateralizationRatio,
    liquidationPrice,
    daiAvailable
  };
}
function calcCollateralizationRatio({ deposited, price, generated }) {
  const value = ((deposited * price) / generated) * 100;
  return isNaN(value) ? 0 : value.toFixed(2);
}

function calcLiquidationPrice({ liquidationRatio, deposited, generated }) {
  const value = (liquidationRatio * generated) / (100 * deposited);
  return isNaN(value) ? 0 : value.toFixed(2);
}

function calcDaiAvailable({ deposited, price, liquidationRatio }) {
  const value = deposited * price * (100 / liquidationRatio);
  return isNaN(value) ? 0 : value.toFixed(2);
}

function getUsdPrice(ilkData) {
  return parseFloat(ilkData.feedValueUSD.toString());
}

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
  <Box px="l" py="m">
    <Box>
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

function OpenCDPForm({
  selectedIlk,
  cdpParams,
  handleInputChange,
  daiAvailable
}) {
  const { ilkData } = selectedIlk;
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
        <Box key="ba">
          <Text t="smallCaps" color="gray2" fontWeight="medium">
            {lang.cdp_create.deposit_form_field3_after2}{' '}
            <Text t="textS">{ilkData.liquidationRatio}%</Text>{' '}
          </Text>
          <Text
            t="textS"
            onClick={() => {
              handleInputChange({
                target: {
                  name: 'daiToDraw',
                  value: daiAvailable
                }
              });
            }}
          >
            {daiAvailable} DAI
          </Text>
        </Box>
      </Grid>
    ]
  ];

  return (
    <Grid gridRowGap="l" px="l" py="m" maxWidth="100%">
      <Grid
        gridTemplateColumns="auto"
        gridRowGap="l"
        gridColumnGap="m"
        alignItems="center"
      >
        {fields.map(([title, text, input, renderAfter]) => {
          return (
            <Grid gridRowGap="s" key={title}>
              <Grid gridRowGap="xs">
                <TextBlock t="textM" fontWeight="medium">
                  {title}
                </TextBlock>
                <TextBlock t="textS" color="gray2">
                  {text}
                </TextBlock>
              </Grid>
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
            <Flex justifyContent="center" px="l" py="m">
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

const CDPCreateDepositSidebar = ({
  selectedIlk,
  liquidationPrice,
  collateralizationRatio
}) => {
  const { liquidationPenalty, liquidationRatio, rate } = selectedIlk.ilkData;
  return (
    <Fragment>
      <Card px="l" pb="m">
        <Box>
          {[
            [lang.collateralization, `${collateralizationRatio}%`],
            [lang.liquidation_price, `$${liquidationPrice}`],
            ['Current Price', `$${getUsdPrice(selectedIlk.ilkData)}`],

            [lang.stability_fee, `${rate}%`],
            [lang.liquidation_ratio, `${liquidationRatio}%`],
            [lang.liquidation_penalty, `${liquidationPenalty}%`]
          ].map(([title, value]) => (
            <Grid mt="m" gridRowGap="xs" key={title}>
              <TextBlock t="textM" fontWeight="medium">
                {title}
              </TextBlock>
              <TextBlock t="textS" color="black3">
                {value}
              </TextBlock>
            </Grid>
          ))}
        </Box>
      </Card>
    </Fragment>
  );
};
const CDPCreateDeposit = ({ selectedIlk, cdpParams, dispatch }) => {
  const { gemsToLock, daiToDraw } = cdpParams;
  const { ilkData } = selectedIlk;
  const {
    liquidationPrice,
    collateralizationRatio,
    daiAvailable
  } = calcCDPParams({ ilkData, gemsToLock, daiToDraw });

  function handleInputChange({ target }) {
    dispatch({
      type: `form/set-${target.name}`,
      payload: { value: target.value }
    });
  }
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
              daiAvailable={daiAvailable}
            />
          }
          ratio={[4, 2]}
          sideContent={
            <CDPCreateDepositSidebar
              selectedIlk={selectedIlk}
              collateralizationRatio={collateralizationRatio}
              liquidationPrice={liquidationPrice}
            />
          }
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

const CDPCreateConfirmSummary = ({
  cdpParams,
  selectedIlk,
  capturedDispatch
}) => {
  const { ilkData } = selectedIlk;
  const { liquidationPenalty, liquidationRatio, rate } = ilkData;
  const { gemsToLock, daiToDraw } = cdpParams;
  const { liquidationPrice, collateralizationRatio } = calcCDPParams({
    ilkData,
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
