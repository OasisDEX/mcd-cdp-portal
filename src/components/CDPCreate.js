import React, { useState, useEffect } from 'react';

import StepperUI from 'components/StepperUI';
import { Box, Button, Grid, Text } from '@makerdao/ui-components-core';
import { Block } from 'components/Primitives';

import useMakerTx from 'hooks/useMakerTx';
import useMaker from 'hooks/useMaker';
import TwoColumnCardsLayout from 'layouts/TwoColumnCardsLayout';
import { TxLifecycle } from 'utils/constants';
import { TextBlock } from 'components/Typography';
import { hot } from 'react-hot-loader/root';

const ScreenHeader = ({ title, text }) => {
  return (
    <Box textAlign="center" py="m">
      <TextBlock t="p1">{title}</TextBlock>
      <TextBlock t="p6">{text}</TextBlock>
    </Box>
  );
};
const ScreenFooter = ({ setStep, loading, screenIndex }) => {
  return (
    <Box textAlign="center">
      <Button
        width="110px"
        variant="secondary-outline"
        onClick={() => {
          setStep(screenIndex - 1);
        }}
      >
        Back
      </Button>
      <Button
        // loading={createProxyTx.status === TxLifecycle.PENDING}
        loading={loading}
        width="145px"
        onClick={() => {
          setStep(screenIndex + 1);
        }}
      >
        Continue
      </Button>
    </Box>
  );
};

const ScreenOneSidebar = () => (
  <Box p="s">
    <TextBlock t="p2">Risk Parameters</TextBlock>
    <Box mt="s">
      {[
        [
          'Stability Fee',
          'The fee calculated on top of the existing debt of the CDP. This is paid when paying back Dai.'
        ],
        [
          'Liquidation Ratio',
          'The collateral-to-dai ratio at which a CDP becomes vulnerable to liquidation. '
        ],
        [
          'Liquidation Fee',
          'The fee that is added to the total outstanding DAI debt when a liquidation occurs.'
        ]
      ].map(([title, text]) => (
        <Box mt="xs">
          <TextBlock t="p3">{title}</TextBlock>
          <TextBlock t="p6">{text}</TextBlock>
        </Box>
      ))}
    </Box>
  </Box>
);
const ScreenOne = () => {
  return (
    <Box>
      <ScreenHeader
        title="Select a collateral type"
        text="Each collateral type has its own risk parameters. You can lock up additional collateral types later."
      />
      <TwoColumnCardsLayout sideContent={<ScreenOneSidebar />} />
      <ScreenFooter setStep={() => {}} loading screenIndex={3} />
    </Box>
  );
};
const screens = {
  'Select Collateral': props => <ScreenOne />,
  'Generate Dai': () => <div>sup</div>,
  Confirmation: () => <div>here</div>
};

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
    text: 'test'
  };
  return (
    <StepperUI
      step={step}
      show={show}
      onClose={onClose}
      steps={Object.keys(screens)}
    >
      {Object.values(screens).map(fn => fn(screenProps))}
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
