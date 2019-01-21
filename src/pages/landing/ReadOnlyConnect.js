import React from 'react';
import { NavLink } from 'react-navi';
import styled from 'styled-components';
import { Button } from '@makerdao/ui-components';

const StyleLink = styled(NavLink)`
  color: inherit;
  text-decoration: none;
`;

function ReadOnlyConnect() {
  return (
    <Button variant="secondary-outline" width="225px">
      <StyleLink href="/read-only/overview">Read-Only</StyleLink>
    </Button>
  );
}

export default ReadOnlyConnect;
