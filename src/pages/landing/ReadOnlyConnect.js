import React from 'react';
import { NavLink } from 'react-navi';
import styled from 'styled-components';
import { Button } from '@makerdao/ui-components';

const StyleLink = styled(NavLink)`
  color: white;
  text-decoration: none;
`;

function ReadOnlyConnect() {
  return (
    <Button>
      <StyleLink href="/read-only/overview">View in read-only mode</StyleLink>
    </Button>
  );
}

export default ReadOnlyConnect;
