import React, { useReducer, useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import StepperUI from 'components/StepperUI';
import StepperHeader from 'components/StepperHeader';
import {
  CDPCreateSelectCollateral,
  CDPCreateSetAllowance,
  CDPCreateConfirmCDP,
  CDPCreateDeposit
} from 'components/CDPCreateScreens';
import useMaker from 'hooks/useMaker';

const screens = [
  ['Select Collateral', props => <CDPCreateSelectCollateral {...props} />],
  ['Proxy Setup', props => <CDPCreateSetAllowance {...props} />],
  ['Generate Dai', props => <CDPCreateDeposit {...props} />],
  ['Confirmation', props => <CDPCreateConfirmCDP {...props} />]
];

const initialState = {
  step: 0,
  proxyAddress: null,
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
        step: state.step + ((payload && payload.by) || 1)
      };
    case 'decrement-step':
      return {
        ...state,
        step: state.step - ((payload && payload.by) || 1)
      };
    case 'set-proxy-address':
      return {
        ...state,
        proxyAddress: payload.address
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
  const { maker, account } = useMaker();
  const [
    { step, selectedIlk, proxyAddress, ...cdpParams },
    dispatch
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    const checkProxy = async () => {
      try {
        const address = await maker.service('proxy').currentProxy();
        dispatch({ type: 'set-proxy-address', payload: { address } });
      } catch (err) {}
    };

    checkProxy();
  }, [maker, account]);

  const screenProps = {
    selectedIlk,
    proxyAddress,
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
