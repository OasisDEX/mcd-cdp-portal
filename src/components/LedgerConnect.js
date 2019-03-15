import React, { memo, useState, Fragment } from 'react';
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
import useModal from 'hooks/useModal';

// added components
import {
  AddressContainer,
  Table,
  InlineTd,
  CopyBtn,
  CopyBtnIcon
} from './HotColdTable';
import ButtonCard from './ButtonCard';
import { BreakableText } from './Typography';

const LEDGER_LIVE_PATH = "44'/60'/0'";
// const LEDGER_LEGACY_PATH = "44'/60'/0'/0";
const DEFAULT_ACCOUNTS_PER_PAGE = 5;

// hack to get around button padding for now
const StyledLedgerLogo = styled(LedgerLogo)`
  margin-top: -5px;
  margin-bottom: -5px;
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

// const addLedgerAccount = async (maker, setAddresses) => {
//   try {
//     await maker.addAccount({
//       type: AccountTypes.LEDGER,
//       path: LEDGER_LIVE_PATH,
//       accountsOffset: 0,
//       accountsLength: DEFAULT_ACCOUNTS_PER_PAGE,
//       choose: addresses => {
//         const addressBalancePromises = addresses.map(address =>
//           addMkrAndEthBalance({
//             address,
//             type: AccountTypes.LEDGER
//           })
//         );
//         console.log('addressBalancePromises', addressBalancePromises);
//         return Promise.all(addressBalancePromises).then(addressBalances =>
//           setAddresses(addressBalances)
//         );
//       }
//     });
//   } catch (err) {
//     window.alert(err.toString());
//   }
// };

// const onConfirm = async (maker, address) => {
//   await maker.addAccount({ address, type: AccountTypes.LEDGER });
//   console.log('list account', maker.listAccounts);
//   maker.useAccountWithAddress(address);

//   const connectedAddress = maker.currentAddress();
//   console.log('connectedAddress', connectedAddress);

//   mixpanelIdentify(connectedAddress, AccountTypes.LEDGER);

//   const {
//     network,
//     address: urlParamAddress
//   } = navigation.receivedRoute.url.query;

//   const addressToView = urlParamAddress || connectedAddress;

//   navigation.history.push({
//     pathname: '/overview/',
//     search: `?network=${network}&address=${addressToView}`
//   });
// };
// const onBack = () => {},
//   onLedgerLegacy = () => {},
//   onCancel = () => {};

//Ledger step component, to be moved into separate component//
// const LedgerStep = ({ active, onLedgerLive, onLedgerLegacy, onCancel }) => {
//   return (
//     <Grid gridRowGap="m">
//       {/* <OnboardingHeader
//         mt={[0, 0, 0, 'l']}
//         title="Ledger live or legacy"
//         subtitle="Due to a firmware update, you will need to choose between Ledger
//       Live and Ledger legacy."
//       /> */}
//       <ButtonCard
//         icon={<StyledLedgerLogo />}
//         onNext={onLedgerLive}
//         title="Ledger live"
//         subtitle={<BreakableText color="grey">{"44'/60'/0'/0"}</BreakableText>}
//         buttonText="Connect"
//       />
//       <ButtonCard
//         icon={<StyledLedgerLogo />}
//         onNext={onLedgerLegacy}
//         title="Ledger legacy"
//         subtitle={<BreakableText color="grey">{"44'/60'/0'/0"}</BreakableText>}
//         buttonText="Connect"
//       />
//       <Box justifySelf="center">
//         <Button variant="secondary-outline" onClick={onCancel}>
//           Select another wallet
//         </Button>
//       </Box>
//     </Grid>
//   );
// };
//End Ledger step component//

const LedgerConnect = memo(function() {
  // const [addresses, setAddresses] = useState([]);
  // const [selectedAddress, setSelectedAddress] = useState('');
  // const [ledgerStepModelOpen, setledgerStepModalBool] = useState(false);
  // const [modelOpen, setModalBool] = useState(false);
  // const { maker, authenticated: makerAuthenticated } = useMaker();
  const { showByType } = useModal();
  console.log('show by tp', showByType);

  return (
    <Fragment>
      {/* <Modal
        show={ledgerStepModelOpen}
        onClose={() => {
          setledgerStepModalBool(false);
        }}
      >
        <LedgerStep
          onLedgerLive={() => {
            setledgerStepModalBool(false);
            setModalBool(true);
            addLedgerAccount(maker, setAddresses);
          }}
          onLedgerLegacy={onLedgerLegacy}
          onCancel={onCancel}
        />
      </Modal> */}
      {/* <Modal
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
                      checked={address === selectedAddress}
                      onChange={() => setSelectedAddress(address)}
                    />
                  </td>
                  <td>{index + 1}</td>

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
        <Grid
          gridRowGap="xs"
          gridColumnGap="s"
          gridTemplateColumns={['1fr', 'auto auto']}
          justifySelf={['stretch', 'center']}
        >
          <Button variant="secondary-outline" onClick={onBack}>
            Change wallet
          </Button>
          <Button
            disabled={!selectedAddress}
            onClick={async () => onConfirm(maker, selectedAddress)}
          >
            Confirm wallet
          </Button>
        </Grid>
      </Modal> */}

      <Button
        variant="secondary-outline"
        width="225px"
        onClick={() => showByType('ledgertype')}
      >
        <Flex alignItems="center">
          <StyledLedgerLogo />
          <span style={{ margin: 'auto' }}>
            {lang.landing_page.ledger_nano}
          </span>
        </Flex>
      </Button>
    </Fragment>
  );
});

export default LedgerConnect;

// function mapStateToProps(state) {
//   return {
//     ...state
//   };
// }

// export default connect(mapStateToProps)(LedgerConnect);

/**
 * <Button
        icon={<StyledLedgerLogo />}
        onNext={onLedgerLive}
        title="Ledger live"
        subtitle={<BreakableText color="grey">{"44'/60'/0'/0"}</BreakableText>}
        buttonText="Connect"
      />
      <Button
        icon={<StyledLedgerLogo />}
        onNext={onLedgerLegacy}
        title="Ledger legacy"
        subtitle={<BreakableText color="grey">{"44'/60'/0'/0"}</BreakableText>}
        buttonText="Connect"
      />
      <Box justifySelf="center">
        <Button variant="secondary-outline" onClick={onCancel}>
          Select another wallet
        </Button>
      </Box>
 */
