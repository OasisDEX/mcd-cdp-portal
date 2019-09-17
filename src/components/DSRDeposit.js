import React, { useReducer, useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import StepperUI from 'components/StepperUI';
import StepperHeader from 'components/StepperHeader';
import {
  DSRDepositCheckProxy,
  DSRDepositCreate,
  DSRDepositConfirm
} from 'components/DSROpenScreens';
import useMaker from 'hooks/useMaker';

const screens = [
  ['Open Earn Vault', props => <DSRDepositCheckProxy {...props} />],
  ['Deposit Dai', props => <DSRDepositCreate {...props} />],
  ['Confirmation', props => <DSRDepositConfirm {...props} />]
];

const initialState = {
  step: 0,
  proxyAddress: null,
  userDaiBalance: '',
  currency: null,
  data: {},
  key: '',
  daiToJoin: ''
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
    case 'set-dai-data':
      return {
        ...state,
        userDaiBalance: payload.userDaiBalance,
        currency: payload.currency,
        data: payload.data,
        key: payload.key
      };
    case 'reset-dai-data':
      return {
        ...state,
        userDaiBalance: '',
        currency: null,
        data: {},
        key: ''
      };
    case 'form/set-daiToJoin':
      return { ...state, daiToJoin: payload.value };
    case 'reset':
      return { ...initialState };
    default:
      return state;
  }
}

function DSRDeposit({ onClose }) {
  const { maker, account } = useMaker();
  const [
    { step, proxyAddress, userDaiBalance, data, key },
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
    proxyAddress,
    userDaiBalance,
    data,
    key,
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

export default hot(DSRDeposit);
