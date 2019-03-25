import React from 'react';

import lang from 'languages';

import { Link, useCurrentRoute } from 'react-navi';
import { Button } from '@makerdao/ui-components-core';

function ReadOnlyConnect() {
  const { url } = useCurrentRoute();
  return (
    <Link href={`/overview/${url.search}`} prefetch={true}>
      <Button variant="secondary-outline" width="225px">
        {lang.landing_page.read_only}
      </Button>
    </Link>
  );
}

export default ReadOnlyConnect;
