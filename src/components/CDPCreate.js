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
import { TxLifecycle } from 'utils/constants';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useWalletBalances from 'hooks/useWalletBalances';
import { watch } from 'hooks/useObservable';
import useCdpTypes from '../hooks/useCdpTypes';
import useMaker from 'hooks/useMaker';

const initialState = {
  step: 0,
  proxyAddress: null,
  selectedIlk: {
    userGemBalance: '',
    currency: null,
    key: '',
    gem: null,
    symbol: undefined
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
          gem: payload.gem,
          symbol: payload.symbol,
          userGemBalance: payload.gemBalance,
          currency: payload.currency,
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
  const { account } = useMaker();
  let [{ step, selectedIlk, ...cdpParams }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const { cdpTypesList } = useCdpTypes();
  const prices = watch.collateralTypesPrices(cdpTypesList);

  const collateralTypePrice =
    watch.collateralTypePrice(selectedIlk.symbol) || BigNumber(0);

  const priceWithSafetyMargin = watch.priceWithSafetyMargin(selectedIlk.symbol);

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

  const annualStabilityFee =
    watch.annualStabilityFee(selectedIlk.symbol) || BigNumber(0);

  const liquidationPenalty =
    watch.liquidationPenalty(selectedIlk.symbol) || BigNumber(0);

  const liquidationRatio =
    watch.liquidationRatio(selectedIlk.symbol) ||
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

  const debtFloor = watch.debtFloor(selectedIlk?.currency?.symbol);

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
    hasAllowance,
    proxyAddress,
    debtFloor,
    balances,
    annualStabilityFee,
    liquidationPenalty,
    prices
  };

  const { lang } = useLanguage();
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
