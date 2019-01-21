import React from 'react';
import { NavLink } from 'react-navi';
import { Button } from '@makerdao/ui-components';

function ReadOnlyConnect() {
  return (
    <NavLink href="/read-only/overview" precache={true}>
      <Button variant="secondary-outline" width="225px">
        Read-Only
      </Button>
    </NavLink>
  );
}

export default ReadOnlyConnect;
