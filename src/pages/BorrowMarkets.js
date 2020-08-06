import React from 'react';
import { hot } from 'react-hot-loader/root';
import useLanguage from 'hooks/useLanguage';
import useCdpTypes from 'hooks/useCdpTypes';
import { watch } from 'hooks/useObservable';
import {
  PageHead,
  StyledPageContentLayout,
  TokenIcon
} from 'components/Marketing';
import { Box, Flex, Text, Table } from '@makerdao/ui-components-core';
import groupBy from 'lodash.groupby';
import BigNumber from 'bignumber.js';
import { formatter, prettifyNumber } from 'utils/ui';
import styled from 'styled-components';

const tokenNames = {
  ETH: 'Ether',
  BAT: 'Basic Attention Token',
  WBTC: 'Wrapped Bitcoin',
  USDC: 'USD Coin',
  MANA: 'Mana',
  ZRX: '0x',
  KNC: 'Kyber Network',
  TUSD: 'TrueUSD'
};

function BorrowMarkets() {
  const { lang } = useLanguage();
  const { cdpTypesList } = useCdpTypes();
  const collateralTypesData = watch.collateralTypesData(cdpTypesList);

  const cdpTypesByGem = groupBy(
    collateralTypesData,
    type => type.symbol.split('-')[0]
  );

  return (
    <StyledPageContentLayout>
      <PageHead
        title={lang.borrow_markets.meta.title}
        description={lang.borrow_landing.meta.description}
        imgUrl="https://oasis.app/meta/Oasis_Borrow.png"
      />
      <Box maxWidth="790px" m="0 auto">
        <Text.h3>{lang.borrow_markets.heading}</Text.h3>
        <Text>{lang.borrow_markets.subheading}</Text>
      </Box>
      <Table>
        <Table.thead>
          <Table.th>{lang.overview_page.token}</Table.th>
          <Table.th>{lang.stability_fee}</Table.th>
          <Table.th>{lang.borrow_markets.min_col_ratio}</Table.th>
          <Table.th>{lang.dai_available}</Table.th>
        </Table.thead>
        {collateralTypesData &&
          Object.entries(cdpTypesByGem).map(([gem, cdpTypesData]) => {
            cdpTypesData = cdpTypesData.map(data => {
              const collateralDebtAvailable = data.collateralDebtAvailable?.toBigNumber();

              const maxDaiAvailableToGenerate = collateralDebtAvailable?.lt(0)
                ? BigNumber(0)
                : collateralDebtAvailable;

              return {
                maxDaiAvailableToGenerate,
                ...data
              };
            });

            // aggregate data
            const fees = cdpTypesData.map(data => data.annualStabilityFee);
            const minFee = BigNumber.min.apply(null, fees);
            const maxFee = BigNumber.max.apply(null, fees);
            const colRatios = cdpTypesData.map(data =>
              data.liquidationRatio.toBigNumber()
            );
            const minRatio = BigNumber.min.apply(null, colRatios);
            const maxRatio = BigNumber.max.apply(null, colRatios);
            const daiAvailableList = cdpTypesData.map(
              data => data.maxDaiAvailableToGenerate
            );
            const totalDaiAvailable = BigNumber.sum.apply(
              null,
              daiAvailableList
            );

            return [
              <Table.tbody key={gem}>
                <Table.tr>
                  <Table.td>
                    <Flex alignItems="center">
                      <TokenIcon symbol={gem} size={31.67} />
                      <span>{tokenNames[gem]} </span>
                      <span>{gem}</span>
                    </Flex>
                  </Table.td>
                  <Table.td>
                    {formatter(minFee, { percentage: true })}%
                    {!minFee.eq(maxFee) && (
                      <> - {formatter(maxFee, { percentage: true })}%</>
                    )}
                  </Table.td>
                  <Table.td>
                    {formatter(minRatio, {
                      percentage: true
                    })}
                    %
                    {!minRatio.eq(maxRatio) && (
                      <>
                        {' - '}
                        {formatter(maxRatio, {
                          percentage: true
                        })}
                        %
                      </>
                    )}
                  </Table.td>
                  <Table.td>
                    {prettifyNumber(totalDaiAvailable, { truncate: true })}
                  </Table.td>
                </Table.tr>
              </Table.tbody>,
              <Table.tbody
                key={gem + '-risk-profiles'}
                style={{ background: '#F6F8F9' }}
              >
                {cdpTypesData.map(cdpType => (
                  <Table.tr key={cdpType.symbol}>
                    <Table.td>
                      {gem} - {lang.borrow_markets.risk_profile}{' '}
                      {cdpType.symbol.split('-')[1]}
                    </Table.td>
                    <Table.td>
                      {formatter(cdpType.annualStabilityFee, {
                        percentage: true
                      })}
                      %
                    </Table.td>
                    <Table.td>
                      {formatter(cdpType.liquidationRatio, {
                        percentage: true
                      })}
                      %
                    </Table.td>
                    <Table.td>
                      {prettifyNumber(cdpType.maxDaiAvailableToGenerate, {
                        truncate: true
                      })}
                    </Table.td>
                  </Table.tr>
                ))}
              </Table.tbody>
            ];
          })}
      </Table>
    </StyledPageContentLayout>
  );
}

export default hot(BorrowMarkets);
