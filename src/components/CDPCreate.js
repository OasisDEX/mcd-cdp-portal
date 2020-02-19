import React, { useReducer, useMemo } from 'react';
import { MDAI, USD, ETH } from '@makerdao/dai-plugin-mcd';
import { createCurrencyRatio } from '@makerdao/currency';
import * as math from '@makerdao/dai-plugin-mcd/dist/math';
import BigNumber from 'bignumber.js';
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
import useStore from 'hooks/useStore';
import { TxLifecycle } from 'utils/constants';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useWalletBalances from 'hooks/useWalletBalances';
import { watch } from 'hooks/useObservable';

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
  targetCollateralizationRatio: '',
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
    case 'transaction-confirmed':
      return { ...state, txState: TxLifecycle.CONFIRMED };
    case 'reset':
      return { ...initialState };
    default:
      return state;
  }
}

function CDPCreate({ onClose }) {
  let [{ step, selectedIlk, ...cdpParams }, dispatch] = useReducer(
    reducer,
    initialState
  );

  /////OBSERVABLES
  const collateralTypePrice =
    watch.collateralTypePrice(selectedIlk.data.symbol) || BigNumber(0);

  const priceWithSafetyMargin = watch.priceWithSafetyMargin(
    selectedIlk.data.symbol
  );
  const daiAvailable =
    priceWithSafetyMargin?.times(BigNumber(cdpParams.gemsToLock)) ||
    BigNumber(0);

  const collateralValue = collateralTypePrice.times(
    BigNumber(cdpParams.gemsToLock || '0')
  );
  const debtValue = MDAI(cdpParams.daiToDraw || '0');

  const collateralizationRatio = math.collateralizationRatio(
    collateralValue,
    debtValue
  );

  const liquidationRatio =
    watch.liquidationRatio(selectedIlk.data.symbol) ||
    createCurrencyRatio(USD, MDAI)('0');

  //TODO: WIP: use the currency function from the ilk
  // eg selectedIlk.currency(gemsToLock),
  const liquidationPrice = math.liquidationPrice(
    ETH(cdpParams.gemsToLock || '0'),
    debtValue,
    liquidationRatio
  );

  const {
    hasAllowance,
    hasSufficientAllowance,
    proxyAddress
  } = useTokenAllowance(selectedIlk?.currency?.symbol);

  const balances = useWalletBalances();
  delete balances.DSR;

  const observables = {
    collateralTypePrice,
    priceWithSafetyMargin,
    daiAvailable,
    collateralValue,
    debtValue,
    collateralizationRatio,
    liquidationRatio,
    liquidationPrice,
    hasSufficientAllowance,
    hasAllowance
  };

  //TODO remove allowance/proxy:
  cdpParams = { ...cdpParams, hasAllowance, proxyAddress };

  const { lang } = useLanguage();
  const [{ cdps }] = useStore();
  const isFirstVault = Object.entries(cdps).length === 0 ? true : false;

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
    proxyAddress,
    cdpParams,
    isFirstVault,
    dispatch,
    balances,
    observables,
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
