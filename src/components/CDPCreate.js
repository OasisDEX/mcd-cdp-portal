import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Flex, Grid, Box, Text } from '@makerdao/ui-components-core';
import StepperUI from 'components/StepperUI';
import {
  CDPCreateSelectCollateral,
  CDPCreateConfirmCDP,
  CDPCreateDeposit
} from 'components/CDPCreateScreens';
import { ReactComponent as CloseIcon } from 'images/close-circle.svg';
import WalletSelection from './WalletSelection';
import useMaker from 'hooks/useMaker';

const screens = [
  ['Select Collateral', props => <CDPCreateSelectCollateral {...props} />],
  ['Generate Dai', props => <CDPCreateDeposit {...props} />],
  ['Confirmation', props => <CDPCreateConfirmCDP {...props} />]
];

const initialState = {
  step: 0,
  selectedIlk: {
    userGemBalance: '',
    currency: null,
    data: {},
    key: ''
  },
  gemsToLock: '',
  daiToDraw: '',
  targetCollateralizationRatio: ''
};

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'increment-step':
      return {
        ...state,
        step: state.step + 1
      };
    case 'decrement-step':
      return {
        ...state,
        step: state.step - 1
      };
    case 'set-ilk':
      return {
        ...state,
        selectedIlk: {
          userGemBalance: payload.gemBalance,
          currency: payload.currency,
          data: payload.data,
          key: payload.key
        }
      };
    case 'reset-ilk':
      return {
        ...state,
        selectedIlk: {}
      };
    case 'form/set-gemsToLock':
      return { ...state, gemsToLock: payload.value };
    case 'form/set-daiToDraw':
      return { ...state, daiToDraw: payload.value };
    case 'form/set-targetCollateralizationRatio':
      return {
        ...state,
        targetCollateralizationRatio: payload.value
      };
    case 'reset':
      return { ...initialState };
    default:
      return state;
  }
}

const CDPCreateHeader = ({ onClose }) => {
  const { account } = useMaker();
  return (
    <Flex justifyContent="flex-end" alignItems="center" mr="xl" mb="m">
      <Grid
        gridColumnGap="l"
        gridTemplateColumns="auto auto auto"
        alignItems="center"
      >
        <Box width="auto">
          <WalletSelection
            currentAccount={account}
            textColor="steel"
            t="1.6rem"
            readOnly
          />
        </Box>

        <Grid
          onClick={onClose}
          gridTemplateColumns="auto auto"
          alignItems="center"
          gridColumnGap="xs"
          css={{ cursor: 'pointer' }}
        >
          <CloseIcon />
          <Text color="steel" t="1.6rem" fontWeight="medium">
            Close
          </Text>
        </Grid>
      </Grid>
    </Flex>
  );
};

function CDPCreate({ onClose }) {
  const [{ step, selectedIlk, ...cdpParams }, dispatch] = React.useReducer(
    reducer,
    initialState
  );

  const screenProps = {
    selectedIlk,
    cdpParams,
    dispatch,
    onClose
  };

  return (
    <StepperUI
      step={step}
      steps={screens.map(([title]) => title)}
      renderStepperHeader={() => <CDPCreateHeader onClose={onClose} />}
    >
      {screens.map(([, getComponent], screenIndex) =>
        getComponent({ ...screenProps, screenIndex, key: screenIndex })
      )}
    </StepperUI>
  );
}

export default hot(CDPCreate);
