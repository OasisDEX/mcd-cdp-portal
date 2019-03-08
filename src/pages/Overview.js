import React from 'react';
import PageContentLayout from 'layouts/PageContentLayout';
import lang from 'languages';
import { Heading } from 'components/Typography';
import { Box } from '@makerdao/ui-components-core';

function Overview() {
  return (
    <PageContentLayout>
      <Box pr="m" mb="m">
        <Heading color="black2">{lang.overview_page.title}</Heading>
      </Box>
    </PageContentLayout>
  );
}

export default Overview;
