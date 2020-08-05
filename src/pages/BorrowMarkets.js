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
import { Box, Flex, Text } from '@makerdao/ui-components-core';
import groupBy from 'lodash.groupby';
import BigNumber from 'bignumber.js';
import { formatter } from '../utils/ui';
import styled from 'styled-components';

const StyledTable = styled.table`
  td {
    padding-top: 8px;
    padding-bottom: 8px;
  }
`;

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
      <StyledTable style={{ width: '1090px', margin: '0 auto' }}>
        <thead>
          <th>TOKEN</th>
          <th>STABILITY FEE</th>
          <th>MIN COLATERAL RATIO</th>
          <th>DAI AVAILABLE</th>
        </thead>
        {collateralTypesData &&
          Object.entries(cdpTypesByGem).map(([gem, cdpTypesData]) => {
            return [
              <tbody key={gem}>
                <tr>
                  <td>
                    <Flex alignItems="center">
                      <TokenIcon symbol={gem} size={31.67} />
                      <strong>{gem}</strong>
                    </Flex>
                  </td>
                </tr>
              </tbody>,
              <tbody
                key={gem + '-risk-profiles'}
                style={{ background: '#F6F8F9' }}
              >
                {cdpTypesData.map(cdpType => {
                  let { collateralDebtAvailable } = cdpType;
                  collateralDebtAvailable = collateralDebtAvailable?.toBigNumber();

                  const maxDaiAvailableToGenerate = collateralDebtAvailable?.lt(
                    0
                  )
                    ? BigNumber(0)
                    : collateralDebtAvailable;

                  return (
                    <tr key={cdpType.symbol}>
                      <td>{cdpType.symbol}</td>
                      <td>{cdpType.annualStabilityFee.toFixed(2)}%</td>
                      <td>
                        {formatter(cdpType.liquidationRatio, {
                          percentage: true
                        })}
                        %
                      </td>
                      <td>{formatter(maxDaiAvailableToGenerate)} Dai</td>
                    </tr>
                  );
                })}
              </tbody>
            ];
          })}
      </StyledTable>
    </StyledPageContentLayout>
  );
}

export default hot(BorrowMarkets);
