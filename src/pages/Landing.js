import React from 'react';
import styled from 'styled-components';
import { Header, Footer, Flex } from '@makerdao/ui-components';
import lang from '../languages';

import MetaMaskConnect from './landing/MetaMaskConnect';
import ReadOnlyConnect from './landing/ReadOnlyConnect';

import LedgerConnect from './landing/LedgerConnect';
import TrezorConnect from './landing/TrezorConnect';
import WalletConnect from './landing/WalletConnect';

const Container = styled.div`
  background: ${({ white }) => (white ? '#fff' : '#f6f8f9')};
  text-align: center;
  min-height: 540px;
  width: 100%;
`;

const Title = styled.div`
  font-size: 45px;
  color: #231536;
  width: 500px;
  line-height: 54px;
  font-weight: 500;
  text-align: left;
`;

const Subtitle = styled.div`
  margin-top: 10px;
  line-height: 31px;
  font-size: 19.5px;
  color: #48495f;
  letter-spacing: 0.2px;
  width: 561px;
  text-align: left;
`;

function Landing() {
  return (
    <Container>
      <Header />
      <Container>
        <Flex justifyContent="space-evenly" height="400px" alignItems="center">
          <div>
            <Title>{lang.landing_page.title}</Title>
            <Subtitle>{lang.landing_page.subtitle}</Subtitle>
          </div>
          <Flex
            justifyContent="space-around"
            height="280px"
            flexDirection="column"
          >
            <MetaMaskConnect />
            <LedgerConnect />
            <TrezorConnect />
            <WalletConnect />
            <ReadOnlyConnect />
          </Flex>
        </Flex>
      </Container>
      <Container white />
      <Footer />
    </Container>
  );
}

export default Landing;
