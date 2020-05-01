import styled from 'styled-components';
import { Box } from '@makerdao/ui-components-core';

// Make sure the parent is centered on the page.
// credit to https://codepen.io/maddesigns/pen/rOMgpQ/
export default styled(Box)`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
`;
