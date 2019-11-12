import React from 'react';
import {
  Box,
  Grid,
  Table,
  Radio,
  Overflow,
  Card
} from '@makerdao/ui-components-core';
import { TextBlock } from 'components/Typography';

import { prettifyNumber } from 'utils/ui';
import { getIlkData } from 'reducers/feeds';

import useStore from 'hooks/useStore';
import useWalletBalances from 'hooks/useWalletBalances';
import useCollateralTypes from 'hooks/useCollateralTypes';
import { useTokenAllowances } from 'hooks/useTokenAllowance';
import useMaker from 'hooks/useMaker';
import useLanguage from 'hooks/useLanguage';
import ScreenFooter from '../ScreenFooter';
import ScreenHeader from '../ScreenHeader';

const CDPCreateSelectCollateralSidebar = () => {
  const { lang } = useLanguage();
  return (
    <Box px="l" py="m">
      <Box>
        {[
          [lang.stability_fee, lang.cdp_create.stability_fee_description],
          [
            lang.liquidation_ratio,
            lang.cdp_create.liquidation_ratio_description
          ],
          [
            lang.liquidation_penalty,
            lang.cdp_create.liquidation_penalty_description
          ]
        ].map(([title, text]) => (
          <Grid mb="m" key={title} gridRowGap="xs">
            <TextBlock t="h5" lineHeight="normal">
              {title}
            </TextBlock>
            <TextBlock t="body">{text}</TextBlock>
          </Grid>
        ))}
      </Box>
    </Box>
  );
};

function IlkTableRow({ ilk, checked, gemBalance, dispatch }) {
  const [{ feeds }] = useStore();

  ilk.data = getIlkData(feeds, ilk.key);

  async function selectIlk() {
    dispatch({
      type: 'set-ilk',
      payload: {
        key: ilk.key,
        gemBalance,
        currency: ilk.currency,
        data: ilk.data
      }
    });
  }

  return (
    <tr css="white-space: nowrap;">
      <td onClick={selectIlk}>
        <Radio checked={checked} readOnly mr="xs" />
      </td>
      <td>{ilk.symbol}</td>
      <td>{ilk.data.stabilityFee} %</td>
      <td>{ilk.data.liquidationRatio} %</td>
      <td>{ilk.data.liquidationPenalty} %</td>
      <td css="text-align: right">
        {prettifyNumber(gemBalance)} {ilk.gem}
      </td>
    </tr>
  );
}

const CDPCreateSelectCollateral = ({ selectedIlk, proxyAddress, dispatch }) => {
  const { maker } = useMaker();
  const { lang } = useLanguage();
  const collateralTypes = useCollateralTypes();
  const balances = useWalletBalances();
  const allowances = useTokenAllowances();
  const hasAllowance =
    selectedIlk.currency && allowances[selectedIlk.currency.symbol];
  const ilkIsEth =
    selectedIlk.currency && selectedIlk.currency.symbol === 'ETH';
  const hasAllowanceAndProxy = (hasAllowance || ilkIsEth) && !!proxyAddress;

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
      <Grid
        gridTemplateColumns={{ s: 'minmax(0, 1fr)', l: '2fr 1fr' }}
        gridGap="m"
        my="l"
      >
        <div>
          <Card px="l" py="l">
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
                    <th>{lang.stability_fee}</th>
                    <th>{lang.liquidation_ratio_shortened}</th>
                    <th>{lang.liquidation_penalty_shortened}</th>
                    <th css="text-align: right">{lang.your_balance}</th>
                  </tr>
                </thead>
                <tbody>
                  {collateralTypes.map(
                    ilk =>
                      balances[ilk.gem] && (
                        <IlkTableRow
                          key={ilk.key}
                          checked={ilk.key === selectedIlk.key}
                          dispatch={dispatch}
                          ilk={ilk}
                          gemBalance={balances[ilk.gem]}
                        />
                      )
                  )}
                </tbody>
              </Table>
            </Overflow>
          </Card>
        </div>
        <Card>
          <CDPCreateSelectCollateralSidebar />
        </Card>
      </Grid>
      <ScreenFooter
        onNext={() =>
          dispatch({
            type: 'increment-step',
            payload: { by: hasAllowanceAndProxy ? 2 : 1 }
          })
        }
        onBack={() => dispatch({ type: 'decrement-step' })}
        canGoBack={false}
        canProgress={!!selectedIlk.key}
      />
    </Box>
  );
};
export default CDPCreateSelectCollateral;
