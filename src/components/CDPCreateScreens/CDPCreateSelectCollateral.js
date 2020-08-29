import React from 'react';
import {
  Box,
  Grid,
  Table,
  Radio,
  Overflow,
  Card,
  Text,
  Tooltip
} from '@makerdao/ui-components-core';
import { TextBlock } from 'components/Typography';
import { prettifyNumber, formatter } from 'utils/ui';
import useCdpTypes from 'hooks/useCdpTypes';
import useLanguage from 'hooks/useLanguage';
import useAnalytics from 'hooks/useAnalytics';
import ScreenFooter from '../ScreenFooter';
import ScreenHeader from '../ScreenHeader';
import BigNumber from 'bignumber.js';

const Help = ({ title, text }) => (
  <Tooltip
    content={
      <Card width="361px" p="s">
        <TextBlock t="h5" fontSize="m">
          {title}
        </TextBlock>
        <Text fontSize="ss">{text}</Text>
      </Card>
    }
  />
);

function IlkTableRow({
  ilk,
  checked,
  gemBalance,
  isFirstVault,
  dispatch,
  ilkData
}) {
  const { trackInputChange } = useAnalytics('SelectCollateral', 'VaultCreate');
  const { annualStabilityFee, liquidationRatio, liquidationPenalty } = ilkData;

  async function selectIlk() {
    trackInputChange('CollateralType', {
      selectedCollateral: ilk.symbol,
      isFirstVault
    });
    dispatch({
      type: 'set-ilk',
      payload: {
        gem: ilk.gem,
        symbol: ilk.symbol,
        gemBalance,
        currency: ilk.currency
      }
    });
  }
  const disabled = ilk.gem === 'TUSD';

  return (
    <tr
      style={disabled ? { color: '#ADADAD' } : { whiteSpace: 'nowrap' }}
      onClick={() => !disabled && selectIlk()}
    >
      <td>
        <Radio
          disabled={disabled}
          checked={checked}
          readOnly
          mr="xs"
          css={{
            appearance: 'none'
          }}
        />
      </td>
      <td>
        <div>{ilk.symbol}</div>
        {disabled && (
          <div style={{ fontSize: '11px', paddingBottom: '5px' }}>
            Unavailable due to a token upgrade
          </div>
        )}
      </td>
      <td>
        {formatter(annualStabilityFee, {
          percentage: true,
          rounding: BigNumber.ROUND_HALF_UP
        })}{' '}
        %
      </td>
      <td>{formatter(liquidationRatio, { percentage: true })} %</td>
      <td>{formatter(liquidationPenalty, { percentage: true })} %</td>
      <td css="text-align: right">
        {ilk.gem === 'USDC'
          ? prettifyNumber(gemBalance, { truncate: true })
          : prettifyNumber(gemBalance)}{' '}
        {ilk.gem}
      </td>
    </tr>
  );
}

const CDPCreateSelectCollateral = ({
  selectedIlk,
  isFirstVault,
  hasAllowance,
  proxyAddress,
  balances,
  collateralTypesData,
  dispatch
}) => {
  const { trackBtnClick } = useAnalytics('SelectCollateral', 'VaultCreate');
  const { lang } = useLanguage();
  const { cdpTypes } = useCdpTypes();
  const hasAllowanceAndProxy = hasAllowance && !!proxyAddress;

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
      <Card px="l" py="l" my="l">
        <Overflow x="scroll" y="visible">
          <Table
            width="100%"
            css={`
              th,
              td {
                padding-right: 10px;
              }
            `}
          >
            <thead>
              <tr css="white-space: nowrap;">
                <th />
                <th>{lang.collateral_type}</th>
                <th>
                  {lang.stability_fee}{' '}
                  <Help
                    title={lang.stability_fee}
                    text={lang.cdp_create.stability_fee_description}
                  />
                </th>
                <th>
                  {lang.liquidation_ratio_shortened}{' '}
                  <Help
                    title={lang.liquidation_ratio}
                    text={lang.cdp_create.liquidation_ratio_description}
                  />
                </th>
                <th>
                  {lang.liquidation_penalty_shortened}{' '}
                  <Help
                    title={lang.liquidation_penalty}
                    text={lang.cdp_create.liquidation_penalty_description}
                  />
                </th>
                <th css="text-align: right">{lang.your_balance}</th>
              </tr>
            </thead>
            <tbody>
              {cdpTypes.map(
                ilk =>
                  collateralTypesData &&
                  balances[ilk.gem] && (
                    <IlkTableRow
                      key={ilk.symbol}
                      checked={ilk.symbol === selectedIlk.symbol}
                      dispatch={dispatch}
                      ilk={ilk}
                      gemBalance={balances[ilk.gem]}
                      isFirstVault={isFirstVault}
                      ilkData={collateralTypesData.find(
                        x => x.symbol === ilk.symbol
                      )}
                    />
                  )
              )}
            </tbody>
          </Table>
        </Overflow>
      </Card>
      <ScreenFooter
        onNext={() => {
          trackBtnClick('Next', {
            selectedCollateral: selectedIlk.symbol,
            isFirstVault
          });
          dispatch({
            type: 'increment-step',
            payload: { by: hasAllowanceAndProxy ? 2 : 1 }
          });
        }}
        onBack={() => {
          trackBtnClick('Back', { isFirstVault });
          dispatch({ type: 'decrement-step' });
        }}
        canGoBack={false}
        canProgress={!!selectedIlk.symbol}
      />
    </Box>
  );
};
export default CDPCreateSelectCollateral;
