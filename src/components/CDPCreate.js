import React, { useReducer } from 'react';
import { hot } from 'react-hot-loader/root';
import StepperUI from 'components/StepperUI';
import StepperHeader from 'components/StepperHeader';
import {
  CDPCreateSelectCollateral,
  CDPCreateSetAllowance,
  CDPCreateConfirmCDP,
  CDPCreateDeposit
} from 'components/CDPCreateScreens';

const screens = [
  ['Select Collateral', props => <CDPCreateSelectCollateral {...props} />],
  ['Deploy Proxy', props => <CDPCreateSetAllowance {...props} />],
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

function CDPCreate({ onClose }) {
  const [{ step, selectedIlk, ...cdpParams }, dispatch] = useReducer(
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
      renderStepperHeader={() => <StepperHeader onClose={onClose} />}
    >
      {screens.map(([, getComponent], screenIndex) =>
        getComponent({ ...screenProps, screenIndex, key: screenIndex })
      )}
    </StepperUI>
  );
}

export default hot(CDPCreate);
