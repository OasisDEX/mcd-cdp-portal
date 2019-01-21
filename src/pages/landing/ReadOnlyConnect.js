import React from 'react';

import lang from 'languages';

import { NavLink } from 'react-navi';
import { Button } from '@makerdao/ui-components';

function ReadOnlyConnect() {
  return (
    <NavLink href="/read-only/overview" precache={true}>
      <Button variant="secondary-outline" width="225px">
        {lang.landing_page.read_only}
      </Button>
    </NavLink>
  );
}

export default ReadOnlyConnect;
