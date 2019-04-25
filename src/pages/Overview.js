import React from 'react';
import { hot } from 'react-hot-loader/root';
import PageContentLayout from 'layouts/PageContentLayout';
import lang from 'languages';
import { Text } from '@makerdao/ui-components-core';

function Overview() {
  return (
    <PageContentLayout>
      <Text.h2 pr="m" mb="m" color="darkPurple">
        {lang.overview_page.title}
      </Text.h2>
    </PageContentLayout>
  );
}

export default hot(Overview);
