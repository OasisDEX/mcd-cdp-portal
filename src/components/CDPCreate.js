import React, { useReducer, useMemo } from 'react';
import { hot } from 'react-hot-loader/root';
import StepperUI from 'components/StepperUI';
import StepperHeader from 'components/StepperHeader';
import {
  CDPCreateSelectCollateral,
  CDPCreateSetAllowance,
  CDPCreateConfirmCDP,
  CDPCreateDeposit
} from 'components/CDPCreateScreens';
import useLanguage from 'hooks/useLanguage';
import { TxLifecycle } from 'utils/constants';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useWalletBalances from 'hooks/useWalletBalances';
import { watch } from 'hooks/useObservable';
import useCdpTypes from '../hooks/useCdpTypes';
import useMaker from 'hooks/useMaker';
import useProxy from 'hooks/useProxy';

const initialState = {
  step: 0,
  selectedIlk: {
    userGemBalance: '',
    currency: null,
    gem: null,
    symbol: undefined
  },
  gemsToLock: '',
  daiToDraw: '',
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
    case 'set-ilk':
      return {
        ...state,
        selectedIlk: {
          gem: payload.gem,
          symbol: payload.symbol,
          userGemBalance: payload.gemBalance,
          currency: payload.currency
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
    case 'transaction-confirmed':
      return { ...state, txState: TxLifecycle.CONFIRMED };
    case 'reset':
      return { ...initialState };
    default:
      return state;
  }
}

function CDPCreate({ onClose }) {
  const { lang } = useLanguage();
  const { account } = useMaker();
  const { proxyAddress } = useProxy();
  let [{ step, selectedIlk, ...cdpParams }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const { cdpTypesList } = useCdpTypes();
  const collateralTypesData = watch.collateralTypesData(cdpTypesList);

  const { hasAllowance, hasSufficientAllowance } = useTokenAllowance(
    selectedIlk?.currency?.symbol
  );

  const balances = useWalletBalances();

  const rawUserVaultsList = watch.userVaultsList(account?.address);
  const isFirstVault = rawUserVaultsList?.length === 0 ? true : false;

  const screens = useMemo(
    () => [
      [
        lang.cdp_create.screen_titles.select_collateral,
        props => <CDPCreateSelectCollateral {...props} />
      ],
      [
        lang.cdp_create.screen_titles.vault_management,
        props => <CDPCreateSetAllowance {...props} />
      ],
      [
        lang.cdp_create.screen_titles.generate_dai,
        props => <CDPCreateDeposit {...props} />
      ],
      [
        lang.cdp_create.screen_titles.confirmation,
        props => <CDPCreateConfirmCDP {...props} />
      ]
    ],
    [lang]
  );

  const screenProps = {
    selectedIlk,
    cdpParams,
    isFirstVault,
    dispatch,
    hasSufficientAllowance,
    hasAllowance,
    proxyAddress,
    balances,
    collateralTypesData,
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
