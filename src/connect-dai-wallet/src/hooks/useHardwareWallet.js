import { useCallback } from 'react';
import { AccountTypes } from '../utils/constants';
import { addMkrAndEthBalance } from '../utils/ethereum';

const TREZOR_PATH = "44'/60'/0'/0/0";

const computeAddressBalances = addresses =>
  Promise.all(
    addresses.map(address =>
      addMkrAndEthBalance({
        address
      })
    )
  );

const DEFAULT_ACCOUNTS_LENGTH = 25;

// Helper hook to show trezor connection modals. Only for use in this app.
export function useTrezor({ onAccountChosen, modal }) {
  const { show } = modal;
  const connectTrezorWallet = useCallback(
    path => {
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
    },
    [show, onAccountChosen]
  );

  return { connectTrezorWallet };
}

// Helper hook to show ledger connection modals. Only for use in this app.
export function useLedger({ onAccountChosen, modal }) {
  const { show } = modal;
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

  const connectLedgerWallet = useCallback(
    path => {
      show({
        modalType: 'ledgertype',
        modalProps: {
          onPathSelect: accountSelection
        }
      });
    },
    [show]
  );

  return { connectLedgerWallet };
}
