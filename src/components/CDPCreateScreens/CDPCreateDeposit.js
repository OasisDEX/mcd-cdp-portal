import React from 'react';
import { Box, Grid, Text, Input, Card } from '@makerdao/ui-components-core';
import { greaterThanOrEqual } from 'utils/bignumber';
import { TextBlock } from 'components/Typography';
import { getUsdPrice, calcCDPParams } from 'utils/cdp';
import { formatCollateralizationRatio, prettifyNumber } from 'utils/ui';
import { cdpParamsAreValid } from '../../utils/cdp';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useLanguage from 'hooks/useLanguage';

import ScreenFooter from '../ScreenFooter';
import ScreenHeader from '../ScreenHeader';

function OpenCDPForm({
  selectedIlk,
  cdpParams,
  handleInputChange,
  daiAvailable
}) {
  const { lang } = useLanguage();
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
        selectedIlk.currency.symbol
      ),
      lang.formatString(
        lang.cdp_create.deposit_form_field1_text,
        selectedIlk.currency.symbol
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
                selectedIlk.currency.symbol
              )
        }
      />,
      <Box key="ba">
        <Text t="subheading">{lang.your_balance} </Text>
        <Text
          t="caption"
          display="inline-block"
          ml="s"
          color="darkLavender"
          onClick={() => {
            handleInputChange({
              target: {
                name: 'gemsToLock',
                value: selectedIlk.userGemBalance
              }
            });
          }}
        >
          {prettifyNumber(selectedIlk.userGemBalance)} {selectedIlk.data.gem}
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
          <Text t="subheading">
            {lang.cdp_create.deposit_form_field3_after2}{' '}
          </Text>
          <Text
            display="inline-block"
            ml="s"
            t="caption"
            color="darkLavender"
            onClick={() => {
              handleInputChange({
                target: {
                  name: 'daiToDraw',
                  value: daiAvailable
                }
              });
            }}
          >
            {prettifyNumber(daiAvailable)} DAI
          </Text>
        </Box>
      </Grid>
    ]
  ];

  return (
    <Grid gridRowGap="l" maxWidth="100%">
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
                <TextBlock t="h5" lineHeight="normal">
                  {title}
                </TextBlock>
                <TextBlock t="body">{text}</TextBlock>
              </Grid>
              <Box py="2xs">{input}</Box>
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
  const { lang } = useLanguage();
  const {
    liquidationPenalty,
    liquidationRatio,
    rate,
    debtCeiling,
    ilkDebtAvailable
  } = selectedIlk.data;
  return (
    <Grid gridRowGap="m">
      {[
        [
          lang.collateralization,
          formatCollateralizationRatio(collateralizationRatio)
        ],
        [lang.liquidation_price, `$${liquidationPrice.toFixed(2)}`],
        ['Current Price', `$${getUsdPrice(selectedIlk.data).toFixed(2)}`],

        [lang.stability_fee, `${rate}%`],
        [lang.liquidation_ratio, `${liquidationRatio}%`],
        [lang.liquidation_penalty, `${liquidationPenalty}%`],
        [lang.collateral_debt_ceiling, `${prettifyNumber(debtCeiling)} DAI`],
        [lang.dai_available, prettifyNumber(ilkDebtAvailable)]
      ].map(([title, value]) => (
        <Grid gridRowGap="xs" key={title}>
          <TextBlock t="h5" lineHeight="normal">
            {title}
          </TextBlock>
          <TextBlock t="body">{value}</TextBlock>
        </Grid>
      ))}
    </Grid>
  );
};

const CDPCreateDeposit = ({ selectedIlk, cdpParams, dispatch }) => {
  const { gemsToLock, daiToDraw } = cdpParams;
  const {
    liquidationPrice,
    collateralizationRatio,
    daiAvailable
  } = calcCDPParams({ ilkData: selectedIlk.data, gemsToLock, daiToDraw });
  const { hasAllowance } = useTokenAllowance(selectedIlk.currency.symbol);
  const { lang } = useLanguage();

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
      <Grid
        gridTemplateColumns={{ s: 'minmax(0, 1fr)', l: '2fr 1fr' }}
        gridGap="m"
        my="l"
      >
        <Card px={{ s: 'm', m: 'xl' }} py={{ s: 'm', m: 'l' }}>
          <OpenCDPForm
            cdpParams={cdpParams}
            handleInputChange={handleInputChange}
            selectedIlk={selectedIlk}
            daiAvailable={daiAvailable}
          />
        </Card>
        <Card px={{ s: 'm', m: 'xl' }} py={{ s: 'm', m: 'l' }}>
          <CDPCreateDepositSidebar
            selectedIlk={selectedIlk}
            collateralizationRatio={collateralizationRatio}
            liquidationPrice={liquidationPrice}
          />
        </Card>
      </Grid>
      <ScreenFooter
        onNext={() => dispatch({ type: 'increment-step' })}
        onBack={() =>
          dispatch({
            type: 'decrement-step',
            payload: { by: hasAllowance ? 2 : 1 }
          })
        }
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
