import React, { useState } from 'react';
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
import usePrevious from '../hooks/usePrevious';
import Carat from 'components/Carat';

const tokenNames = {
  ETH: 'Ethereum',
  BAT: 'Basic Attention Token',
  WBTC: 'Wrapped Bitcoin',
  USDC: 'USD Coin',
  MANA: 'Mana',
  ZRX: '0x',
  KNC: 'Kyber Network',
  TUSD: 'TrueUSD'
};

const TABLE_PADDING = '33px';

const Number = styled(Text)``;
const GrayText = styled(Text)``;

const StyledTable = styled(Table)`
  width: 100%;
  min-width: 401px;
  max-width: 1090px;
  margin: 61px auto 0;

  ${Text} {
    color: ${props => props.theme.colors.darkPurple};
    font-size: ${props => props.theme.fontSizes.s};
  }

  ${Number} {
    font-size: 15px;
  }

  ${GrayText} {
    color: #6f838f;
  }

  .gem {
    color: ${props => props.theme.colors.darkPurple};
  }

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    .gem {
      color: #6f838f;
    }
  }

  ${Table.thead}, .summary:not(:nth-last-child(2)) {
    border-bottom: 1px solid #e8e8e8;
  }

  .expand-btn {
    padding: 6px 0;
    cursor: pointer;
    svg {
      stroke: #9aa3ad;
      transition: transform 0.2s;
    }

    &:hover svg {
      stroke: #60666c;
    }
  }

  .summary.expanded {
    border-bottom: none;

    .expand-btn svg {
      transform: rotate(180deg);
    }
  }

  .risk-profiles {
    ${Table.td} {
      background-color: #f6f8f9;
    }
    ${Table.tr}:first-child {
      .firstTD {
        border-top-left-radius: 6px;
      }
      .lastTD {
        border-top-right-radius: 6px;
      }
    }
    ${Table.tr}:last-child {
      .firstTD {
        border-bottom-left-radius: 6px;
      }
      .lastTD {
        border-bottom-right-radius: 6px;
      }
    }

    display: none;
    &.expanded {
      display: table-row-group;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.m}) {
    ${Table.td}, ${Table.th} {
      padding-right: 6px;
    }
  }
`;

function BorrowMarkets() {
  const { lang } = useLanguage();
  const { cdpTypesList } = useCdpTypes();
  let collateralTypesData = watch.collateralTypesData(cdpTypesList);
  const prevData = usePrevious(collateralTypesData);
  collateralTypesData = collateralTypesData || prevData;

  const cdpTypesByGem = groupBy(
    collateralTypesData,
    type => type.symbol.split('-')[0]
  );
  const [expandedRows, setExpandedRows] = useState({});
  const isExpanded = rowIndex => expandedRows[rowIndex];
  const toggleRow = index => {
    setExpandedRows({ ...expandedRows, [index]: !isExpanded(index) });
  };

  return (
    <StyledPageContentLayout
      css={`
        overflow: scroll;
      `}
    >
      <PageHead
        title={lang.borrow_markets.meta.title}
        description={lang.borrow_landing.meta.description}
        imgUrl="https://oasis.app/meta/Oasis_Borrow.png"
      />
      <Box maxWidth="790px" m="0 auto">
        <Text.h3>{lang.borrow_markets.heading}</Text.h3>
        <Text>{lang.borrow_markets.subheading}</Text>
      </Box>
      <StyledTable>
        <Table.thead>
          <Table.tr>
            <Table.th width={{ s: '0', m: TABLE_PADDING }} />
            <Table.th width={{ s: '30px', m: '49px' }} />
            <Table.th minWidth="80px">{lang.overview_page.token}</Table.th>
            <Table.th width={{ s: 'unset', xl: '190px' }}>
              {lang.stability_fee}
            </Table.th>
            <Table.th width={{ s: 'unset', xl: '190px' }}>
              {lang.borrow_markets.min_col_ratio}
            </Table.th>
            <Table.th width={{ s: 'unset', xl: '190px' }}>
              {lang.dai_available}
            </Table.th>
            <Table.th />
            <Table.th width={{ s: '0', m: TABLE_PADDING }} />
          </Table.tr>
        </Table.thead>
        {collateralTypesData &&
          Object.entries(cdpTypesByGem).map(([gem, cdpTypesData], rowIndex) => {
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
              <Table.tbody
                key={gem}
                className={`summary ${isExpanded(rowIndex) ? 'expanded' : ''}`}
              >
                <Table.tr>
                  <Table.td borderBottom="1px solid white" />
                  <Table.td>
                    <TokenIcon symbol={gem} size={31.67} />
                  </Table.td>
                  <Table.td>
                    <Text display={{ s: 'none', m: 'inline' }}>
                      {tokenNames[gem]}
                    </Text>
                    <GrayText ml="8px" className="gem">
                      {gem}
                    </GrayText>
                  </Table.td>
                  <Table.td>
                    <Number>
                      {formatter(minFee, { percentage: true })}%
                      {!minFee.eq(maxFee) && (
                        <> - {formatter(maxFee, { percentage: true })}%</>
                      )}
                    </Number>
                  </Table.td>
                  <Table.td>
                    <Number>
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
                    </Number>
                  </Table.td>
                  <Table.td>
                    <Number>
                      {prettifyNumber(totalDaiAvailable, { truncate: true })}
                    </Number>
                  </Table.td>
                  <Table.td>
                    <div
                      className="expand-btn"
                      onClick={() => toggleRow(rowIndex)}
                    >
                      <Carat />
                    </div>
                  </Table.td>
                  <Table.td borderBottom="1px solid white" />
                </Table.tr>
              </Table.tbody>,
              <Table.tbody
                key={gem + '-risk-profiles'}
                className={`risk-profiles ${
                  isExpanded(rowIndex) ? 'expanded' : ''
                }`}
              >
                {cdpTypesData.map(cdpType => (
                  <Table.tr key={cdpType.symbol} borderBottom="none">
                    <td />
                    <Table.td className="firstTD" />
                    <Table.td>
                      <GrayText>
                        {gem} - {lang.borrow_markets.risk_profile}{' '}
                        {cdpType.symbol.split('-')[1]}
                      </GrayText>
                    </Table.td>
                    <Table.td>
                      <Number>
                        {formatter(cdpType.annualStabilityFee, {
                          percentage: true
                        })}
                        %
                      </Number>
                    </Table.td>
                    <Table.td>
                      <Number>
                        {formatter(cdpType.liquidationRatio, {
                          percentage: true
                        })}
                        %
                      </Number>
                    </Table.td>
                    <Table.td>
                      <Number>
                        {prettifyNumber(cdpType.maxDaiAvailableToGenerate, {
                          truncate: true
                        })}
                      </Number>
                    </Table.td>
                    <Table.td className="lastTD" />
                    <td />
                  </Table.tr>
                ))}
              </Table.tbody>
            ];
          })}
      </StyledTable>
    </StyledPageContentLayout>
  );
}

export default hot(BorrowMarkets);
