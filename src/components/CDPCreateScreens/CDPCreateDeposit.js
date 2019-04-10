import React, { Fragment } from 'react';
import { Box, Grid, Text, Input, Card } from '@makerdao/ui-components-core';
import { greaterThanOrEqual } from 'utils/bignumber';
import { TextBlock } from 'components/Typography';
import TwoColumnCardsLayout from 'layouts/TwoColumnCardsLayout';
import { getUsdPrice, calcCDPParams } from 'utils/cdp';
import { cdpParamsAreValid, formatCollateralizationRatio } from 'utils/ui';

import lang from 'languages';
import ScreenFooter from './ScreenFooter';
import ScreenHeader from './ScreenHeader';

function OpenCDPForm({
  selectedIlk,
  cdpParams,
  handleInputChange,
  daiAvailable
}) {
  const userHasSufficientGemBalance = greaterThanOrEqual(
    selectedIlk.userGemBalance,
    cdpParams.gemsToLock
  );
  const userCanDrawDaiAmount = greaterThanOrEqual(
    daiAvailable,
    cdpParams.daiToDraw
  );

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
        after={selectedIlk.data.gem}
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
          {selectedIlk.userGemBalance} {selectedIlk.data.gem}
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
        errorMessage={
          userCanDrawDaiAmount ? null : lang.cdp_create.draw_too_much_dai
        }
        value={cdpParams.daiToDraw}
        onChange={handleInputChange}
      />,
      <Grid gridRowGap="xs" key="keytodrawinfo">
        <Box key="ba">
          <Text t="smallCaps" color="gray2" fontWeight="medium">
            {lang.cdp_create.deposit_form_field3_after2}{' '}
            <Text t="textS">{selectedIlk.data.liquidationRatio}</Text>{' '}
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
  const { liquidationPenalty, liquidationRatio, rate } = selectedIlk.data;
  return (
    <Fragment>
      <Card px="l" pb="m">
        <Box>
          {[
            [
              lang.collateralization,
              formatCollateralizationRatio(collateralizationRatio)
            ],
            [lang.liquidation_price, `$${liquidationPrice.toFixed(2)}`],
            ['Current Price', `$${getUsdPrice(selectedIlk.data).toFixed(2)}`],

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
  const {
    liquidationPrice,
    collateralizationRatio,
    daiAvailable
  } = calcCDPParams({ ilkData: selectedIlk.data, gemsToLock, daiToDraw });

  function handleInputChange({ target }) {
    if (parseFloat(target.value) < 0) return;
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
          selectedIlk.currency.symbol
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
          selectedIlk.userGemBalance,
          selectedIlk.data
        )}
      />
    </Box>
  );
};
export default CDPCreateDeposit;
