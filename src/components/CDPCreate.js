import React from 'react';
import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { getActionableIlks } from 'reducers/addresses';
import { Flex, Grid, Box, Text } from '@makerdao/ui-components-core';
import StepperUI from 'components/StepperUI';
import {
  CDPCreateSelectCollateral,
  CDPCreateConfirmCDP,
  CDPCreateDeposit
} from 'components/CDPCreateScreens';
import { ReactComponent as QuestionIcon } from 'images/question-circle.svg';
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
    ilkData: {},
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
          key: payload.key,
          userGemBalance: payload.gemBalance,
          ilkData: payload.ilkData
        }
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
  const { maker } = useMaker();
  return (
    <Flex justifyContent="flex-end" alignItems="center" mr="xl" mb="m">
      <Grid
        gridColumnGap="l"
        gridTemplateColumns="auto auto auto"
        alignItems="center"
      >
        <Box width="auto">
          <WalletSelection
            address={maker.currentAddress()}
            currentAccount={maker.currentAccount()}
            textColor="steel"
            t="textM"
          />
        </Box>
        <Grid
          onClick={onClose}
          gridTemplateColumns="auto auto"
          alignItems="center"
          gridColumnGap="xs"
        >
          <QuestionIcon />
          <Text color="steel" t="textM" fontWeight="medium">
            FAQ
          </Text>
        </Grid>

        <Grid
          onClick={onClose}
          gridTemplateColumns="auto auto"
          alignItems="center"
          gridColumnGap="xs"
          css={{ cursor: 'pointer' }}
        >
          <CloseIcon />
          <Text color="steel" t="textM" fontWeight="medium">
            Close
          </Text>
        </Grid>
      </Grid>
    </Flex>
  );
};

function CDPCreate({ actionableIlks, onClose }) {
  const [{ step, selectedIlk, ...cdpParams }, dispatch] = React.useReducer(
    reducer,
    initialState
  );

  const screenProps = {
    actionableIlks,
    selectedIlk,
    cdpParams,
    dispatch
  };

  return (
    <StepperUI
      step={step}
      steps={screens.map(([title]) => title)}
      renderStepperHeader={() => <CDPCreateHeader onClose={onClose} />}
    >
      {screens.map(([, fn], screenIndex) =>
        fn({ ...screenProps, screenIndex, key: screenIndex })
      )}
    </StepperUI>
  );
}

export default connect(
  state => ({
    // ie a list of ilks we have the right addresses for
    actionableIlks: getActionableIlks(state)
  }),
  {}
)(hot(CDPCreate));
