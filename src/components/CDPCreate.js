import React, { useState, useEffect } from 'react';
import StepperUI from 'components/StepperUI';
import useMakerTx from 'hooks/useMakerTx';
import useMaker from 'hooks/useMaker';
import { hot } from 'react-hot-loader/root';
import {
  CDPCreateSelectCollateral,
  CDPCreateConfirmCDP,
  CDPCreateDeposit
} from 'components/CDPCreateScreens';

const screens = [
  ['Select Collateral', props => <CDPCreateSelectCollateral {...props} />],
  ['Generate Dai', props => <CDPCreateDeposit {...props} />],
  ['Confirmation', props => <CDPCreateConfirmCDP {...props} />]
];

function CDPCreate({ show, onClose }) {
  const [step, setStep] = useState(0);
  const { authenticatedMaker } = useMaker();
  const [userProxyDetails, setUserProxyDetails] = useState({
    status: 'null',
    address: ''
  });

  const createProxyTx = useMakerTx(maker => maker.service('proxy').build());

  async function checkProxyStatus() {
    const maker = await authenticatedMaker();
    setUserProxyDetails({ status: 'checking', address: '' });
    const proxyAddress = await maker.service('proxy').currentProxy();
    if (!proxyAddress)
      setUserProxyDetails({
        status: 'noProxy',
        address: ''
      });
    else
      setUserProxyDetails({
        address: proxyAddress,
        status: 'found'
      });
  }

  useEffect(() => {
    checkProxyStatus();
  }, []);

  const proxyStatusToUI = {
    null: '',
    checking: 'Checking for user proxy',
    found: <div>proxy address {userProxyDetails.address}</div>,
    noProxy: (
      <div>
        user has no proxy{' '}
        <button
          onClick={() => {
            createProxyTx.send();
          }}
        >
          create a proxy
        </button>
      </div>
    )
  };

  const screenProps = {
    setStep,
    createProxyTx,
    userProxyDetails,
    proxyStatusToUI
  };
  return (
    <StepperUI
      step={step}
      show={show}
      onClose={onClose}
      steps={screens.map(([title]) => title)}
    >
      {screens.map(([title, fn], screenIndex) =>
        fn({ ...screenProps, screenIndex })
      )}
      {/* <Box>
        <Grid gridRowGap="m">
          <Box textAlign="center">
            <Button
              width="145px"
              onClick={() => {
                setStep(1);
              }}
            >
              Continue
            </Button>
          </Box>
        </Grid>
      </Box>

      <Box>
        <Grid gridRowGap="m">

          <Block textAlign="center">
            {proxyStatusToUI[userProxyDetails.status]}
          </Block>
        </Grid>
      </Box>

      <Box> */}
      {/* <Grid gridRowGap="m">
          <Box textAlign="center">
            <Button
              width="110px"
              variant="secondary-outline"
              onClick={() => {
                setStep(1);
              }}
            >
              Back
            </Button>
            <Button width="145px">Create CDP</Button>
          </Box>
        </Grid>
      </Box> */}
    </StepperUI>
  );
}

export default hot(CDPCreate);
