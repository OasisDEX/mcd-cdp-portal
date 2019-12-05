import { useReducer, useCallback } from 'react';
import useMaker from 'hooks/useMaker';
import useModal from 'hooks/useModal';
import { AccountTypes } from 'utils/constants';
import { addMkrAndEthBalance } from 'utils/ethereum';

const TREZOR_PATH = "44'/60'/0'/0/0";

const computeAddressBalances = addresses =>
  Promise.all(
    addresses.map(address =>
      addMkrAndEthBalance({
        address
      })
    )
  );

const initialState = {
  fetching: false,
  accounts: [],
  onAccountChosen: () => {}
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'connect-start':
      return initialState;
    case 'fetch-start':
      return {
        ...state,
        fetching: true
      };
    case 'connect-success':
      return {
        ...state,
        fetching: false,
        onAccountChosen: payload.onAccountChosen
      };
    case 'fetch-success':
      return {
        ...state,
        fetching: false,
        accounts: [...state.accounts, ...payload.accounts]
      };
    case 'error':
      return {
        ...state,
        fetching: false
      };
    default:
      throw new Error(`Unexpected action with type '${type}'`);
  }
};

const DEFAULT_ACCOUNTS_LENGTH = 25;

// Helper hook to show trezor connection modals. Only for use in this app.
export function useTrezor({ onAccountChosen }) {
  const { show } = useModal();

  const connectTrezorWallet = useCallback(() => {
    show({
      modalType: 'hardwareaccountselect',
      modalProps: {
        type: AccountTypes.TREZOR,
        path: TREZOR_PATH,
        confirmAddress: address => {
          onAccountChosen(address, AccountTypes.TREZOR);
        }
      }
    });
  }, [show, onAccountChosen]);

  return { connectTrezorWallet };
}

// Helper hook to show ledger connection modals. Only for use in this app.
export function useLedger({ onAccountChosen }) {
  const { show } = useModal();
  const accountSelection = useCallback(
    path => {
      show({
        modalType: 'hardwareaccountselect',
        modalProps: {
          type: AccountTypes.LEDGER,
          path,
          confirmAddress: address => {
            onAccountChosen(address, AccountTypes.LEDGER);
          }
        }
      });
    },
    [show, onAccountChosen]
  );

  const connectLedgerWallet = useCallback(() => {
    show({
      modalType: 'ledgertype',
      modalProps: {
        onPathSelect: accountSelection
      }
    });
  }, [accountSelection, show]);

  return { connectLedgerWallet };
}

function useHardwareWallet({
  type,
  path,
  accountsLength = DEFAULT_ACCOUNTS_LENGTH
}) {
  const { maker } = useMaker();
  const [state, dispatch] = useReducer(reducer, initialState);

  const connect = useCallback(() => {
    dispatch({ type: 'connect-start' });
    return maker.addAccount({
      type,
      path,
      accountsOffset: 0,
      accountsLength,
      choose: async (addresses, onAccountChosen) => {
        const accounts = await computeAddressBalances(addresses);
        dispatch({ type: 'connect-success', payload: { onAccountChosen } });
        dispatch({ type: 'fetch-success', payload: { accounts, offset: 0 } });
      }
    });
  }, [accountsLength, maker, path, type]);

  const fetchMore = useCallback(() => {
    return new Promise((resolve, reject) => {
      dispatch({ type: 'fetch-start' });
      maker
        .addAccount({
          type,
          path,
          accountsOffset: state.accounts.length,
          accountsLength,
          choose: async addresses => {
            const accounts = await computeAddressBalances(addresses);
            dispatch({
              type: 'fetch-success',
              payload: { accounts, offset: state.accounts.length }
            });
            resolve(accounts);
          }
        })
        .catch(err => {
          dispatch({ type: 'error' });
          reject(err);
        });
    });
  }, [accountsLength, maker, path, type, state.accounts.length]);

  function pickAccount(address) {
    return state.onAccountChosen(null, address);
  }

  return {
    fetchMore,
    connect,
    fetching: state.fetching,
    accounts: state.accounts,
    pickAccount
  };
}

export default useHardwareWallet;
