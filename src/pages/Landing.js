import React from 'react';
import styled from 'styled-components';
import { Header, Footer } from '@makerdao/ui-components';
import MetaMaskConnect from './landing/MetaMaskConnect';
import ReadOnlyConnect from './landing/ReadOnlyConnect';

const Container = styled.div`
  text-align: center;
  min-height: 800px;
  width: 100%;
`;

const StyledTitle = styled.div`
  font-size: 45px;
  line-height: 45px;
  color: #000;
  font-weight: 500;
  padding-top: 100px;
`;

const StyledBody = styled.div`
  font-size: 19.5px;
  line-height: 23px;
  color: #000;
  letter-spacing: 0.3px;
  margin: 23px auto;
  width: 602px;
`;

function Landing() {
  return (
    <Container>
      <Header />
      <Container>
        <StyledTitle>Landing</StyledTitle>
        <StyledBody>This is the landing page.</StyledBody>
        <ReadOnlyConnect />
        <br /> <br />
        <MetaMaskConnect />
      </Container>
      <Footer />
    </Container>
  );
}

export default Landing;
