import React from 'react';

import lang from 'languages';

import { NavLink, NavRoute } from 'react-navi';
import { Button } from '@makerdao/ui-components';

function ReadOnlyConnect() {
  return (
    <NavRoute>
      {({ url }) => (
        <NavLink href={`/overview/${url.search}`} precache={true}>
          <Button variant="secondary-outline" width="225px">
            {lang.landing_page.read_only}
          </Button>
        </NavLink>
      )}
    </NavRoute>
  );
}

export default ReadOnlyConnect;
