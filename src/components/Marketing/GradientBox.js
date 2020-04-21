import React from 'react';
import styled from 'styled-components';
import { FullWidth } from './index';
import { Box } from '@makerdao/ui-components-core';

const Gradient = styled(FullWidth)`
  background: ${props => props.background};
  filter: blur(38px);
  z-index: -1;
  position: absolute;
  top: 0;
  bottom: 0;
`;

const GradientBoxStyle = styled(Box)`
  position: relative;
  padding: 56px 0;

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    padding: 116px 0 121px;
  }
`;

const GradientBox = ({ background, children, ...props }) => (
  <GradientBoxStyle {...props}>
    <Gradient background={background} />
    {children}
  </GradientBoxStyle>
);

export default GradientBox;
