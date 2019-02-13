import React from 'react';
import lang from 'languages';
import styled from 'styled-components';

import { Box } from '@makerdao/ui-components-core';

const View = styled.div`
  padding: 55px 32px;
  background: ${({ theme }) => theme.colors.backgroundGrey};
`;

function Overview() {
  return (
    <View>
      <Box>
        <h2>{lang.overview_page.title}</h2>
      </Box>
    </View>
  );
}

export default Overview;
