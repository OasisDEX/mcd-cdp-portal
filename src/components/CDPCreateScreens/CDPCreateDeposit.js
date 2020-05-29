import React from 'react';
import { Box, Grid, Text, Input, Card } from '@makerdao/ui-components-core';
import { DAI } from '@makerdao/dai-plugin-mcd';
import { greaterThanOrEqual } from 'utils/bignumber';
import { TextBlock } from 'components/Typography';
import {
  formatCollateralizationRatio,
  prettifyNumber,
  formatter
} from 'utils/ui';
import { cdpParamsAreValid } from '../../utils/cdp';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useLanguage from 'hooks/useLanguage';
import useAnalytics from 'hooks/useAnalytics';
import ScreenFooter from '../ScreenFooter';
import ScreenHeader from '../ScreenHeader';
import RatioDisplay, { RatioDisplayTypes } from 'components/RatioDisplay';
import BigNumber from 'bignumber.js';

function OpenCDPForm({
  selectedIlk,
  cdpParams,
  collateralizationRatio,
  handleInputChange,
  ilkData
}) {
  const { lang } = useLanguage();
  const { calculateMaxDai, liquidationRatio, debtFloor } = ilkData;

  const daiAvailable = calculateMaxDai(BigNumber(cdpParams.gemsToLock || '0'));
  const belowDustLimit = debtFloor?.gt(BigNumber(cdpParams.daiToDraw));

  const { hasSufficientAllowance } = useTokenAllowance(selectedIlk.gem);
  const userHasSufficientGemBalance = greaterThanOrEqual(
    selectedIlk.userGemBalance,
    cdpParams.gemsToLock
  );
  const userCanDrawDaiAmount = daiAvailable?.gte(
    BigNumber(cdpParams.daiToDraw === '' ? '0' : cdpParams.daiToDraw)
  );

  const fields = [
    [
      lang.formatString(
        lang.cdp_create.deposit_form_field1_title,
        selectedIlk.gem
      ),
      lang.formatString(
        lang.cdp_create.deposit_form_field1_text,
        selectedIlk.gem
      ),
      <Input
        key="collinput"
        name="gemsToLock"
        after={selectedIlk.gem}
        type="number"
        value={cdpParams.gemsToLock}
        onChange={handleInputChange}
        width={300}
        failureMessage={
          userHasSufficientGemBalance || !cdpParams.gemsToLock
            ? hasSufficientAllowance(
                cdpParams.gemsToLock === '' ? 0 : cdpParams.gemsToLock
              )
              ? null
              : lang.formatString(
                  lang.action_sidebar.invalid_allowance,
                  selectedIlk.gem
                )
            : lang.formatString(
                lang.cdp_create.insufficient_ilk_balance,
                selectedIlk.gem
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
          {selectedIlk.gem === 'USDC'
            ? prettifyNumber(selectedIlk.userGemBalance, { truncate: true })
            : prettifyNumber(selectedIlk.userGemBalance)}{' '}
          {selectedIlk.gem}
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
        width={300}
        type="number"
        failureMessage={
          (belowDustLimit
            ? lang.formatString(lang.cdp_create.below_dust_limit, debtFloor)
            : null) ||
          (userCanDrawDaiAmount ? null : lang.cdp_create.draw_too_much_dai)
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
                  value: formatter(daiAvailable)
                }
              });
            }}
          >
            {formatter(daiAvailable)} DAI
          </Text>
        </Box>
        <RatioDisplay
          type={RatioDisplayTypes.TEXT}
          text={lang.cdp_create.collateralization_warning}
          ratio={formatter(collateralizationRatio)}
          ilkLiqRatio={formatter(liquidationRatio, { percentage: true })}
          onlyWarnings={true}
          t="caption"
        />
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
  cdpParams,
  selectedIlk,
  ilkData,
  collateralizationRatio
}) => {
  const { lang } = useLanguage();
  const currency = selectedIlk.currency;
  const { annualStabilityFee, collateralTypePrice } = ilkData;

  let liquidationPriceDisplay = formatter(
    ilkData.calculateliquidationPrice(
      currency(cdpParams.gemsToLock || '0'),
      DAI(cdpParams.daiToDraw || '0')
    )
  );
  if ([Infinity, 'Infinity'].includes(liquidationPriceDisplay))
    liquidationPriceDisplay = '0.0000';
  return (
    <Grid gridRowGap="m">
      {[
        [
          lang.collateralization,
          <RatioDisplay
            key="ba"
            type={RatioDisplayTypes.TEXT}
            text={`${formatCollateralizationRatio(
              collateralizationRatio
            )} (Min ${formatter(ilkData.liquidationRatio, {
              percentage: true
            })}%)`}
            ratio={formatter(collateralizationRatio)}
            ilkLiqRatio={formatter(ilkData.liquidationRatio, {
              percentage: true
            })}
            t="caption"
          />
        ],
        [lang.liquidation_price, `$${liquidationPriceDisplay}`],
        [
          lang.formatString(lang.current_ilk_price, selectedIlk.gem),
          `$${formatter(collateralTypePrice)}`
        ],
        [
          lang.stability_fee,
          `${formatter(annualStabilityFee, {
            percentage: true,
            rounding: BigNumber.ROUND_HALF_UP
          })}%`
        ]
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

const CDPCreateDeposit = ({
  selectedIlk,
  cdpParams,
  isFirstVault,
  hasSufficientAllowance,
  hasAllowance,
  collateralTypesData,
  dispatch
}) => {
  const { lang } = useLanguage();
  const { trackBtnClick } = useAnalytics('DepositGenerate', 'VaultCreate');

  const { gemsToLock, daiToDraw } = cdpParams;

  const ilkData = collateralTypesData.find(
    x => x.symbol === selectedIlk.symbol
  );
  const { calculateMaxDai, debtFloor } = ilkData;
  const daiAvailable = calculateMaxDai(BigNumber(cdpParams.gemsToLock || '0'));

  const collateralizationRatio = ilkData.calculateCollateralizationRatio(
    BigNumber(cdpParams.gemsToLock || '0'),
    DAI(cdpParams.daiToDraw || '0')
  );

  function handleInputChange({ target }) {
    if (parseFloat(target.value) < 0) return;
    dispatch({
      type: `form/set-${target.name}`,
      payload: { value: target.value }
    });
  }

  const canProgress =
    cdpParamsAreValid(
      cdpParams,
      selectedIlk.userGemBalance,
      debtFloor,
      daiAvailable
    ) && hasSufficientAllowance(cdpParams.gemsToLock);

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
          selectedIlk.gem
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
            ilkData={ilkData}
            collateralizationRatio={collateralizationRatio}
          />
        </Card>
        <Card px={{ s: 'm', m: 'xl' }} py={{ s: 'm', m: 'l' }}>
          <CDPCreateDepositSidebar
            selectedIlk={selectedIlk}
            cdpParams={cdpParams}
            ilkData={ilkData}
            collateralizationRatio={collateralizationRatio}
          />
        </Card>
      </Grid>
      <ScreenFooter
        onNext={() => {
          trackBtnClick('Next', {
            lock: gemsToLock,
            generate: daiToDraw,
            isFirstVault
          });
          dispatch({ type: 'increment-step' });
        }}
        onBack={() => {
          trackBtnClick('Back', { isFirstVault });
          dispatch({
            type: 'decrement-step',
            payload: { by: hasAllowance ? 2 : 1 }
          });
        }}
        canProgress={canProgress}
      />
    </Box>
  );
};
export default CDPCreateDeposit;
