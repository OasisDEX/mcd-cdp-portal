import React from 'react';
import { hot } from 'react-hot-loader/root';
import StepperUI from 'components/StepperUI';
import StepperHeader from 'components/StepperHeader';
import { SelectCDP, PayAndMigrate } from 'components/CDPMigrateScreens';

const screens = [
  ['Select CDP', props => <SelectCDP {...props} />],
  ['Pay & Migrate', props => <PayAndMigrate {...props} />]
];

const initialState = {
  step: 0
};

function reducer(state, action) {
  const { type } = action;
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
    case 'reset':
      return { ...initialState };
    default:
      return state;
  }
}

function CDPMigrate({ onClose }) {
  const [{ step }, dispatch] = React.useReducer(reducer, initialState);

  const screenProps = {
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
        getComponent({ ...screenProps, key: screenIndex })
      )}
    </StepperUI>
  );
}

export default hot(CDPMigrate);
