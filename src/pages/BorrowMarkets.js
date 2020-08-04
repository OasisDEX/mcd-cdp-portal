import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import useLanguage from 'hooks/useLanguage';
import { PageHead, StyledPageContentLayout } from 'components/Marketing';
import useCdpTypes from '../hooks/useCdpTypes';
import { Box, Text } from '@makerdao/ui-components-core';
import groupBy from 'lodash.groupby';

function BorrowMarkets() {
  const { lang } = useLanguage();
  const { cdpTypes } = useCdpTypes();

  useEffect(() => {
    window.cdpTypes = cdpTypes;
  });

  const cdpTypesByGem = groupBy(cdpTypes, 'gem');

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
      {Object.entries(cdpTypesByGem).map(([gem, riskProfiles]) => (
        <div key={gem}>
          <div>
            <strong>{gem}</strong>
          </div>
          <div>
            {riskProfiles.map(cdpType => (
              <div key={cdpType.symbol}>{cdpType.symbol}</div>
            ))}
          </div>
        </div>
      ))}
    </StyledPageContentLayout>
  );
}

export default hot(BorrowMarkets);
