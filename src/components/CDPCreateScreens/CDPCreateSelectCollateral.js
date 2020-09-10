import React from 'react';
import {
  Box,
  Table,
  Overflow,
  Card,
  Text,
  Tooltip,
  Flex
} from '@makerdao/ui-components-core';
import { TextBlock } from 'components/Typography';
import { prettifyNumber, formatter } from 'utils/ui';
import useCdpTypes from 'hooks/useCdpTypes';
import useLanguage from 'hooks/useLanguage';
import useAnalytics from 'hooks/useAnalytics';
import ScreenFooter from '../ScreenFooter';
import ScreenHeader from '../ScreenHeader';
import BigNumber from 'bignumber.js';
import { getMaxDaiAvailable } from 'utils/cdp';

const Help = ({ title, text, ...props }) => (
  <Tooltip
    fontSize="22.9px"
    color="slate.400"
    content={
      <Card
        mt="xs"
        width="361px"
        px="m"
        pt="17px"
        pb="23px"
        boxShadow="0px 1px 3px rgba(190, 190, 190, 0.25)"
        borderRadius="6px"
        border="border: 1px solid #E0E0E0"
      >
        <TextBlock
          t="h5"
          fontSize="m"
          color="#252525"
          letterSpacing="0.3px"
          mb="14px"
        >
          {title}
        </TextBlock>
        <Text fontSize="s" letterSpacing="0.15px" lineHeight="22px" mb="14px">
          {text}
        </Text>
      </Card>
    }
    {...props}
  />
);

const HeaderContent = ({ children, tooltip }) => (
  <Flex color="slate.400" height="24.4px" alignItems="center" my="-3px">
    {children}
    {tooltip && (
      <Help
        title={tooltip.title}
        text={tooltip.text}
        mt="-3px"
        ml="7px"
        mr="2px"
      />
    )}
  </Flex>
);

const CustomRadio = ({ checked, disabled, size = '23px', ...props }) => (
  <Flex
    alignItems="center"
    justifyContent="center"
    width={size}
    height={size}
    {...props}
  >
    <Box
      css={`
        border: 1.4px solid #c4c4c4;
        border-radius: 50%;
        width: calc(${size} - 2px);
        height: calc(${size} - 2px);
        cursor: pointer;

        &.checked {
          transition: all 0.1s ease-out 0s;
          border: 4px solid #1aab9b;
          width: ${size};
          height: ${size};
          cursor: default;
        }

        &.disabled {
          background-color: #f5f5f5;
          cursor: default;
        }
      `}
      className={`${disabled && 'disabled'} ${checked &&
        'checked'} radio-circle`}
    />
  </Flex>
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
  const { lang } = useLanguage();

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
      css={
        !disabled &&
        !checked &&
        `
        &:hover {
          .radio-circle {
            border-color: #979797;
          }
        }
      `
      }
      onClick={() => !disabled && selectIlk()}
    >
      <td style={{ paddingRight: '14px' }}>
        <CustomRadio disabled={disabled} checked={checked} mr="xs" />
      </td>
      <td>
        <div>{ilk.symbol}</div>
        {disabled && (
          <div style={{ fontSize: '11px', marginRight: '-6px' }}>
            {lang.cdp_create.select_unavailable}
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
      <td>
        {ilk.gem === 'USDC'
          ? prettifyNumber(gemBalance, { truncate: true })
          : prettifyNumber(gemBalance)}{' '}
        {ilk.gem}
      </td>
      <td>{prettifyNumber(getMaxDaiAvailable(ilkData), true)}</td>
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
      <Card px="l" pb="l" pt="26px" my="l" borderRadius="6px">
        <Overflow x="scroll" y="visible">
          <Table
            width="100%"
            css={`
              th,
              td {
                padding-right: 27px;
              }

              th {
                padding-bottom: 1px;
              }

              td {
                padding-top: 10px;
                padding-bottom: 10px;
              }
            `}
            fontSize="m"
            mb="6px"
          >
            <thead>
              <tr css="white-space: nowrap;">
                <th />
                <th>
                  <HeaderContent>{lang.collateral_type}</HeaderContent>
                </th>
                <th>
                  <HeaderContent
                    tooltip={{
                      title: lang.stability_fee,
                      text: lang.cdp_create.stability_fee_description
                    }}
                  >
                    {lang.stability_fee}{' '}
                  </HeaderContent>
                </th>
                <th>
                  <HeaderContent
                    tooltip={{
                      title: lang.liquidation_ratio,
                      text: lang.cdp_create.liquidation_ratio_description
                    }}
                  >
                    {lang.liquidation_ratio_shortened}{' '}
                  </HeaderContent>
                </th>
                <th>
                  <HeaderContent
                    tooltip={{
                      title: lang.liquidation_penalty,
                      text: lang.cdp_create.liquidation_penalty_description
                    }}
                  >
                    {lang.liquidation_penalty_shortened}{' '}
                  </HeaderContent>
                </th>
                <th>
                  <HeaderContent>{lang.your_balance}</HeaderContent>
                </th>
                <th>
                  <HeaderContent>{lang.dai_available}</HeaderContent>
                </th>
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
