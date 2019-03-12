import React, { useState } from 'react';
import { connect } from 'react-redux';

import lang from 'languages';
import styled from 'styled-components';

import { navigation } from '../index';
import { Button, Modal, Flex, Grid, Box } from '@makerdao/ui-components-core';
import { ReactComponent as LedgerLogo } from 'images/ledger.svg';
import { mixpanelIdentify } from 'utils/analytics';
import useMaker from 'hooks/useMaker';
import { cutMiddle, copyToClipboard } from '../utils/ui';
import { AccountTypes } from '../utils/constants';
import { addMkrAndEthBalance } from '../utils/ethereum';

import {
  AddressContainer,
  Table,
  InlineTd,
  CopyBtn,
  CopyBtnIcon
} from './HotColdTable';

const LEDGER_LIVE_PATH = "44'/60'/0'";
// const LEDGER_LEGACY_PATH = "44'/60'/0'/0";
const DEFAULT_ACCOUNTS_PER_PAGE = 5;

// hack to get around button padding for now
const StyledLedgerLogo = styled(LedgerLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
`;

const PaddedDiv = styled.div`
  padding: 20px;
`;

export const StyledTitle = styled.div`
  font-weight: bold;
  color: #212536;
  line-height: 22px;
  font-size: 28px;
`;

export const StyledBlurb = styled.div`
  line-height: 22px;
  font-size: 17px;
  margin: 22px 0px 16px 0px;
`;

export const StyledTop = styled.div`
  display: flex;
  justify-content: center;
`;

const addLedgerAccount = async (maker, setAddresses) => {
  try {
    await maker.addAccount({
      type: AccountTypes.LEDGER,
      path: LEDGER_LIVE_PATH,
      accountsOffset: 0,
      accountsLength: DEFAULT_ACCOUNTS_PER_PAGE,
      choose: addresses => {
        const addressBalancePromises = addresses.map(address =>
          addMkrAndEthBalance({
            address,
            type: AccountTypes.LEDGER
          })
        );
        console.log('addressBalancePromises', addressBalancePromises);
        Promise.all(addressBalancePromises).then(addressBalances =>
          setAddresses(addressBalances)
        );
      }
    });

    // console.log('addedAcct', addedAcct);

    const connectedAddress = maker.currentAddress();

    console.log('connectedAddress', connectedAddress);

    mixpanelIdentify(connectedAddress, AccountTypes.LEDGER);

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
  const [addresses, setAddresses] = useState([]);
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
        <StyledTop>
          <StyledTitle>Select address</StyledTitle>
        </StyledTop>
        <StyledBlurb style={{ textAlign: 'center', marginTop: '14px' }}>
          Please select which address you would like to open
        </StyledBlurb>
        <AddressContainer>
          <Table>
            <thead>
              <tr>
                <th className="radio">Select</th>
                <th>#</th>
                <th>Address</th>
                <th>ETH</th>
                <th>MKR</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map(({ address, ethBalance, mkrBalance }, index) => (
                <tr key={address}>
                  <td className="radio">
                    <input
                      type="radio"
                      name="address"
                      value={index}
                      // checked={address === this.state.selectedAddress}
                      // onChange={() =>
                      //   this.setState({ selectedAddress: address })
                      // }
                    />
                  </td>
                  <td>{index + 1}</td>
                  {/* <td>{index + page * PER_PAGE + 1}</td> */}

                  <InlineTd title={address}>
                    {cutMiddle(address, 7, 5)}
                    <CopyBtn onClick={() => copyToClipboard(address)}>
                      <CopyBtnIcon />
                    </CopyBtn>
                  </InlineTd>
                  <td>{ethBalance} ETH</td>
                  <td>{mkrBalance} MKR</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </AddressContainer>
        {/* <PaddedDiv>
          <h3>{addresses}</h3>
        </PaddedDiv> */}
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
