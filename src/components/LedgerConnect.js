import React, { useState } from 'react';
import { connect } from 'react-redux';

import lang from 'languages';
import styled from 'styled-components';

import { navigation } from '../index';
import { Button, Modal, Flex } from '@makerdao/ui-components-core';
import { ReactComponent as LedgerLogo } from 'images/ledger.svg';
import { mixpanelIdentify } from 'utils/analytics';
import useMaker from 'hooks/useMaker';

// the Ledger subprovider interprets these paths to mean that the last digit is
// the one that should be incremented.
// i.e. the second path for Live is "44'/60'/1'/0/0"
// and the second path for Legacy is "44'/60'/0'/0/1"
const LEDGER_LIVE_PATH = "44'/60'/0'";
const LEDGER_LEGACY_PATH = "44'/60'/0'/0";
const DEFAULT_ACCOUNTS_PER_PAGE = 5;

// hack to get around button padding for now
const StyledLedgerLogo = styled(LedgerLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

const PaddedDiv = styled.div`
  padding: 20px;
`;

async function checkEthereumProvider() {
  return new Promise(async (res, rej) => {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.enable();
      const { selectedAddress, networkVersion } = window.ethereum;
      res({
        networkId: parseInt(networkVersion, 10),
        address: selectedAddress
      });
    } else rej('No web3 provider detected');
  });
}

async function checkLedgerProvider() {
  return new Promise(async (res, rej) => {
    // if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.enable();
    const { selectedAddress, networkVersion } = window.ethereum;
    res({
      networkId: parseInt(networkVersion, 10),
      address: selectedAddress
    });
    // } else rej('No web3 provider detected');
  });
}

const addLedgerAccount = async (maker, setAddresses) => {
  console.log('sanity addledger');
  try {
    const browserProvider = await checkEthereumProvider();
    const connectedNetworkId = maker.service('web3').networkId();

    //chjeck path?
    await maker.addAccount({
      type: 'ledger',
      path: LEDGER_LIVE_PATH,
      accountsOffset: 0,
      accountsLength: DEFAULT_ACCOUNTS_PER_PAGE,
      choose: addresses => {
        console.log('hello');
        console.log(addresses);
        setAddresses(addresses);
      }
    });

    // console.log('addedAcct', addedAcct);

    const connectedAddress = maker.currentAddress();

    console.log('connectedAddress', connectedAddress);

    mixpanelIdentify(connectedAddress, 'metamask');

    const {
      network,
      address: urlParamAddress
    } = navigation.receivedRoute.url.query;

    const addressToView = urlParamAddress || connectedAddress;
    navigation.history.push({
      pathname: '/overview/',
      search: `?network=${network}&address=${addressToView}`
    });
  } catch (err) {
    window.alert(err.toString());
  }
};

function LedgerConnect({ ...state }) {
  const [addresses, setAddresses] = useState(0);
  console.log('state', state);
  const [modelOpen, setModalBool] = useState(false);
  const { maker, authenticated: makerAuthenticated } = useMaker();

  return (
    <>
      <Modal
        show={modelOpen}
        onClose={() => {
          setModalBool(false);
        }}
      >
        <PaddedDiv>
          <h3>{addresses}</h3>
        </PaddedDiv>
      </Modal>

      <Button
        variant="secondary-outline"
        width="225px"
        onClick={() => {
          setModalBool(true);
          addLedgerAccount(maker, setAddresses);
        }}
      >
        <Flex alignItems="center">
          <StyledLedgerLogo />
          <span style={{ margin: 'auto' }}>
            {lang.landing_page.ledger_nano}
          </span>
        </Flex>
      </Button>
    </>
  );
}

function mapStateToProps(state) {
  return {
    ...state
  };
}

export default connect(mapStateToProps)(LedgerConnect);

// export default LedgerConnect;
