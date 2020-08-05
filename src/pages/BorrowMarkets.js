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
import { Box, Text } from '@makerdao/ui-components-core';
import groupBy from 'lodash.groupby';
import BigNumber from 'bignumber.js';
import { formatter } from '../utils/ui';

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
      {collateralTypesData &&
        Object.entries(cdpTypesByGem).map(([gem, cdpTypesData]) => (
          <div key={gem}>
            <div>
              <strong>
                <TokenIcon symbol={gem} size={31.67} />
                {gem}
              </strong>
            </div>
            <div>
              {cdpTypesData.map(cdpType => {
                let { collateralDebtAvailable } = cdpType;
                collateralDebtAvailable = collateralDebtAvailable?.toBigNumber();

                const maxDaiAvailableToGenerate = collateralDebtAvailable?.lt(0)
                  ? BigNumber(0)
                  : collateralDebtAvailable;

                return (
                  <div key={cdpType.symbol}>
                    <span>{cdpType.symbol}</span>{' '}
                    <span>
                      Stability Fee: {cdpType.annualStabilityFee.toFixed(2)}
                    </span>{' '}
                    <span>
                      Max Dai: {formatter(maxDaiAvailableToGenerate)} Dai
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </StyledPageContentLayout>
  );
}

export default hot(BorrowMarkets);
