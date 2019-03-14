import React from 'react';
import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { getActionableIlks } from 'reducers/addresses';

import StepperUI from 'components/StepperUI';
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

const initialState = {
  step: 0,
  selectedIlk: {
    userGemBalance: '',
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
          userGemBalance: payload.gemBalance
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

function CDPCreate({ actionableIlks }) {
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
    <StepperUI step={step} steps={screens.map(([title]) => title)}>
      {screens.map(([title, fn], screenIndex) =>
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
