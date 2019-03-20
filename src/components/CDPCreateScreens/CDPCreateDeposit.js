import React, { Fragment } from 'react';
import { Box, Grid, Text, Input, Card } from '@makerdao/ui-components-core';
import { TextBlock } from 'components/Typography';
import TwoColumnCardsLayout from 'layouts/TwoColumnCardsLayout';
import { getUsdPrice, calcCDPParams, cdpParamsAreValid } from 'utils/ui';

import lang from 'languages';
import ScreenFooter from './ScreenFooter';
import ScreenHeader from './ScreenHeader';

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
        canProgress={cdpParamsAreValid(
          cdpParams,
          selectedIlk.userBalance,
          selectedIlk.ilkData
        )}
      />
    </Box>
  );
};
export default CDPCreateDeposit;
