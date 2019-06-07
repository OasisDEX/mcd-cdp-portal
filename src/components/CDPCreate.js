import React, { useMemo, useReducer, useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import StepperUI from 'components/StepperUI';
import StepperHeader from 'components/StepperHeader';
import {
  CDPCreateSelectCollateral,
  CDPCreateSetAllowance,
  CDPCreateConfirmCDP,
  CDPCreateDeposit
} from 'components/CDPCreateScreens';
import useStore from '../hooks/useStore';
import useMaker from 'hooks/useMaker';
import ilkList from '../references/ilkList';

const screens = [
  ['Select Collateral', props => <CDPCreateSelectCollateral {...props} />],
  ['Proxy Setup', props => <CDPCreateSetAllowance {...props} />],
  ['Generate Dai', props => <CDPCreateDeposit {...props} />],
  ['Confirmation', props => <CDPCreateConfirmCDP {...props} />]
];

const initialState = {
  step: 0,
  proxyAddress: null,
  hasAllowance: null,
  selectedIlk: ilkList[0],
  gemsToLock: 0,
  daiToDraw: 0,
  targetCollateralizationRatio: ''
};

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'increment-step':
      const skipProxySetupForward =
        state.step === 0 && state.proxyAddress && state.hasAllowance;
      return {
        ...state,
        step: state.step + (skipProxySetupForward ? 2 : 1)
      };
    case 'decrement-step':
      const skipProxySetupBackwards =
        state.step === 2 && state.proxyAddress && state.hasAllowance;
      return {
        ...state,
        step: state.step - (skipProxySetupBackwards ? 2 : 1)
      };
    case 'set-proxy-address':
      return {
        ...state,
        proxyAddress: payload.address
      };
    case 'set-ilk-allowance':
      return {
        ...state,
        hasAllowance: payload.hasAllowance
      };
    case 'set-ilk':
      return {
        ...state,
        selectedIlk: {
          ...payload,
          userGemBalance: payload.gemBalance
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
  const [{ ilks }] = useStore();
  const [
    { step, selectedIlk, proxyAddress, hasAllowance, ...cdpParams },
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
    selectedIlk: {
      ...selectedIlk,
      ...ilks[selectedIlk.key]
    },
    proxyAddress,
    hasAllowance,
    cdpParams,
    dispatch,
    onClose
  };

  return useMemo(
    () => (
      <StepperUI
        step={step}
        steps={screens.map(([title]) => title)}
        renderStepperHeader={() => <StepperHeader onClose={onClose} />}
      >
        {screens.map(([, getComponent], screenIndex) =>
          getComponent({ ...screenProps, screenIndex, key: screenIndex })
        )}
      </StepperUI>
    ),
    [onClose, screenProps, step]
  );
}

export default hot(CDPCreate);
