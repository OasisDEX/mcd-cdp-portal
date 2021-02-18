import React, { useState } from 'react';
import styled from 'styled-components';
import { Loader, Table, Text } from '@makerdao/ui-components-core';
import BigNumber from 'bignumber.js';
import { TokenIcon } from './index';
import { parseUniPair, prettifyNumber } from 'utils/ui';
import Carat from '../Carat';
import { getColor } from 'styles/theme';
import useLanguage from 'hooks/useLanguage';
import groupBy from 'lodash.groupby';
import { watch } from 'hooks/useObservable';
import { getMaxDaiAvailable } from 'utils/cdp';
import { TokenNames } from 'utils/constants';

const TABLE_PADDING = '33px';

const Number = styled(Text)``;

const formatPercentage = number =>
  `${prettifyNumber(number.times(100), false, 2, false)}%`;

const MarketsTableStyle = styled(Table)`
  width: 100%;
  min-width: 401px;
  margin: 0 auto;

  ${Text} {
    color: ${props => props.theme.colors.darkPurple};
    font-size: ${props => props.theme.fontSizes.s};
  }

  ${Number} {
    font-size: 15px;
  }

  .gem {
    color: ${props => props.theme.colors.darkPurple};
  }

  .profile-name {
    color: #6f838f;
  }

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    .gem.dimmed {
      color: #6f838f;
    }
  }

  ${Table.th} {
    padding-bottom: 18px;
    color: ${props => props.theme.colors.steel};
  }

  ${Table.thead}, .summary:not(:nth-last-child(2)) {
    border-bottom: 1px solid #e8e8e8;
  }

  ${Table.td} {
    padding-top: 14px;
    padding-bottom: 13px;
  }

  .expand-btn {
    padding: 6px 0;
    svg {
      stroke: #9aa3ad;
      transition: transform 0.2s;
    }
  }

  .summary {
    cursor: pointer;

    td.margin {
      border-bottom: 1px solid white;
    }

    &:hover {
      ${Table.td} {
        background-color: rgba(246, 248, 249, 0.4);
        box-shadow: inset 0 0 6px 3px rgba(255, 255, 255, 0.6);
      }

      .expand-btn svg {
        stroke: #60666c;
      }
    }

    &.expanded {
      border-bottom: none;

      .expand-btn svg {
        transform: rotate(180deg);
      }
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
    /* prettier-ignore */
    ${Table.tr}:nth-last-child(2) {
      .firstTD {
        border-bottom-left-radius: 6px;
      }
      .lastTD {
        border-bottom-right-radius: 6px;
      }
    }

    td,
    div {
      transition: opacity 0s;
      opacity: 0;
      max-height: 0;
    }
    td {
      padding: 0 0;
    }

    &.expanded {
      td,
      div {
        transition: opacity 0.15s ease;
        opacity: 1;
        max-height: 1100px;
      }
      td {
        padding: 12px 0;
      }
      .risk-profiles-margin-row {
        height: 10px;
      }
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.m}) {
    ${Table.td}, ${Table.th} {
      padding-right: 6px;
    }
  }
`;

const MarketsTable = ({ cdpTypesList, ...props }) => {
  const collateralTypesData = watch.collateralTypesData(cdpTypesList);
  const debtCeilings = watch.collateralDebtCeilings(cdpTypesList);
  const { lang } = useLanguage();
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
    <MarketsTableStyle {...props}>
      <Table.thead>
        <Table.tr>
          <Table.th width={{ s: '0', m: TABLE_PADDING }} />
          <Table.th width={{ s: '42px', m: '49px' }} />
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
      {collateralTypesData ? (
        Object.entries(cdpTypesByGem).map(([gem, cdpTypesData], rowIndex) => {
          cdpTypesData = cdpTypesData.map(ilkData => ({
            maxDaiAvailableToGenerate: getMaxDaiAvailable(ilkData),
            ...ilkData
          }));

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
          const totalDaiAvailable = BigNumber.sum.apply(null, daiAvailableList);

          const uniPair = parseUniPair(
            gem,
            Object.keys(cdpTypesByGem).concat(['DAI'])
          );
          const tokenName = uniPair
            ? `Uniswap v2 ${uniPair[0]}/${uniPair[1]}`
            : TokenNames[gem];

          return [
            <Table.tbody
              key={gem}
              className={`summary ${isExpanded(rowIndex) ? 'expanded' : ''}`}
              onClick={() => toggleRow(rowIndex)}
            >
              <Table.tr>
                <td className="margin" />
                <Table.td>
                  <TokenIcon symbol={gem} size={31.67} />
                </Table.td>
                <Table.td>
                  {tokenName && (
                    <Text display={{ s: 'none', m: 'inline' }} mr="8px">
                      {tokenName}
                    </Text>
                  )}
                  <Text className={`gem ${tokenName && 'dimmed'}`}>{gem}</Text>
                </Table.td>
                <Table.td>
                  <Number>
                    {formatPercentage(minFee)}
                    {!minFee.eq(maxFee) && <> - {formatPercentage(maxFee)}</>}
                  </Number>
                </Table.td>
                <Table.td>
                  <Number>
                    {formatPercentage(minRatio)}
                    {!minRatio.eq(maxRatio) && (
                      <>
                        {' - '}
                        {formatPercentage(maxRatio)}
                      </>
                    )}
                  </Number>
                </Table.td>
                <Table.td>
                  <Number>{prettifyNumber(totalDaiAvailable, true)}</Number>
                </Table.td>
                <Table.td>
                  <div className="expand-btn">
                    <Carat />
                  </div>
                </Table.td>
                <td className="margin" />
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
                    <div>
                      <Text className="profile-name">{cdpType.symbol}</Text>
                    </div>
                  </Table.td>
                  <Table.td>
                    <div>
                      <Number>
                        {formatPercentage(cdpType.annualStabilityFee)}
                      </Number>
                    </div>
                  </Table.td>
                  <Table.td>
                    <div>
                      <Number>
                        {formatPercentage(cdpType.liquidationRatio)}
                      </Number>
                    </div>
                  </Table.td>
                  <Table.td>
                    <div>
                      <Number>
                        {prettifyNumber(
                          cdpType.maxDaiAvailableToGenerate,
                          true
                        )}
                        {debtCeilings &&
                          ` / ${prettifyNumber(
                            debtCeilings[cdpType.symbol],
                            true,
                            2,
                            false
                          )}`}
                      </Number>
                    </div>
                  </Table.td>
                  <Table.td className="lastTD" />
                  <td />
                </Table.tr>
              ))}
              <tr className="risk-profiles-margin-row" />
            </Table.tbody>
          ];
        })
      ) : (
        <Table.tbody>
          <tr>
            <td colSpan={8}>
              <Loader
                size="4rem"
                color={getColor('spinner')}
                bg="white"
                m="40px auto"
              />
            </td>
          </tr>
        </Table.tbody>
      )}
    </MarketsTableStyle>
  );
};

export default MarketsTable;
