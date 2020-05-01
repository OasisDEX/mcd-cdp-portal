import React from 'react';
import { Link } from 'react-navi';
import styled from 'styled-components';

const StyledLink = styled(Link)`
  font-size: 22px;
  line-height: 26px;
  font-weight: bold;
`;

export default styled(props => (
  <StyledLink {...props} href="/">
    Oasis
  </StyledLink>
))``;
