import React, { useState, useEffect } from 'react';

import StepperUI from 'components/StepperUI';
import { Box, Button, Grid, Text } from '@makerdao/ui-components-core';
import { Block } from 'components/Primitives';

import { prettifyNumber } from 'utils/ui';
import useMakerState from 'hooks/useMakerState';

const HARDCODED_USER_ADDRESS_FOR_DEVELOPMENT =
  '0x00DaA9a2D88BEd5a29A6ca93e0B7d860cd1d403F';

function CDPCreate({ show, onClose }) {
  const [step, setStep] = useState(0);

  // const ethBalance = 0;
  const ethBalance = useMakerState(maker =>
    maker.getToken('ETH').balanceOf(HARDCODED_USER_ADDRESS_FOR_DEVELOPMENT)
  );

  useEffect(() => {
    ethBalance.prefetch();
  }, []);

  return (
    <StepperUI
      step={step}
      show={show}
      onClose={onClose}
      steps={['Select Collateral', 'Generate Dai', 'Confirmation']}
    >
      <Box>
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
          <Box textAlign="center">
            <Button
              width="110px"
              variant="secondary-outline"
              onClick={() => {
                setStep(0);
              }}
            >
              Back
            </Button>
            <Button
              width="145px"
              onClick={() => {
                setStep(2);
              }}
            >
              Continue
            </Button>
          </Box>
          <Block textAlign="center">
            <Text>YOUR BALANCE </Text>
          </Block>
        </Grid>
      </Box>

      <Box>
        <Grid gridRowGap="m">
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
      </Box>
    </StepperUI>
  );
}

export default CDPCreate;
