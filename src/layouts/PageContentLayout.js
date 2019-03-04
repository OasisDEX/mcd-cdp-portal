import React from 'react';
import styled from 'styled-components';
import { mediaQueries } from 'styles/constants';
const breakpoint = mediaQueries.m.min;

const View = styled.div`
  padding: 25px 12px;

  ${breakpoint} {
    padding: 55px 32px;
  }
`;
const ContentWrap = styled.div`
  max-width: 1200px;
  margin: auto;
`;
const PageContentLayout = ({ children }) => (
  <View>
    <ContentWrap>{children}</ContentWrap>
  </View>
);

export default PageContentLayout;
