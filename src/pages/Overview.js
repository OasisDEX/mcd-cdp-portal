import React from 'react';
import PageContentLayout from 'layouts/PageContentLayout';

import lang from 'languages';

import { Box } from '@makerdao/ui-components-core';

function Overview() {
  return (
    <PageContentLayout>
      <Box>
        <h2>{lang.overview_page.title}</h2>
      </Box>
    </PageContentLayout>
  );
}

export default Overview;
