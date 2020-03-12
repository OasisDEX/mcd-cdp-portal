import React, { useReducer, useEffect, useMemo } from 'react';
import { hot } from 'react-hot-loader/root';
import StepperUI from 'components/StepperUI';
import StepperHeader from 'components/StepperHeader';
import {
  DSRDepositCheckProxy,
  DSRDepositCreate,
  DSRDepositConfirm
} from 'components/DSRDepositScreens';
import useLanguage from 'hooks/useLanguage';
import { TxLifecycle } from 'utils/constants';
import useProxy from 'hooks/useProxy';

const initialState = {
  step: 0,
  daiToJoin: '',
  depositAmount: '',
  txState: ''
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
    case 'form/set-deposit-amount':
      return { ...state, depositAmount: payload.depositAmount };
    case 'transaction-confirmed':
      return { ...state, txState: TxLifecycle.CONFIRMED };
    case 'reset':
      return { ...initialState };
    default:
      return state;
  }
}

function DSRDeposit({ onClose, hideOnboarding }) {
  const { lang } = useLanguage();
  const [{ step, depositAmount, txState }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const screens = useMemo(
    () => [
      [
        lang.dsr_deposit.screen_titles.open_vault,
        props => <DSRDepositCheckProxy {...props} />
      ],
      [
        lang.dsr_deposit.screen_titles.deposit_dai,
        props => <DSRDepositCreate {...props} />
      ],
      [
        lang.dsr_deposit.screen_titles.confirmation,
        props => <DSRDepositConfirm {...props} />
      ]
    ],
    [lang]
  );
  const { proxyAddress } = useProxy();

  useEffect(() => {
    if (proxyAddress) {
      hideOnboarding();
    }
  }, [hideOnboarding, proxyAddress]);

  const screenProps = {
    proxyAddress,
    depositAmount,
    dispatch,
    onClose,
    txState
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
