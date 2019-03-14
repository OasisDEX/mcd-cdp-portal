import { useReducer } from 'react';

import useMaker from './useMaker';
import { TxLifecycle } from 'utils/constants';

const initialState = {
  hash: '',
  sender: '',
  errorMsg: '',
  status: TxLifecycle.NULL
};

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'initialized':
      return {
        ...state,
        sender: payload.sender,
        status: TxLifecycle.INITIALIZED
      };
    case 'pending':
      return { ...state, hash: payload.hash, status: TxLifecycle.PENDING };
    case 'mined':
      return { ...state, status: TxLifecycle.MINED };
    case 'error':
      return { ...state, status: TxLifecycle.ERROR, errorMsg: payload.msg };
    case 'clear':
      return { ...initialState };
    default:
      return state;
  }
}

function useMakerTx(txCreator) {
  const { maker, authenticated } = useMaker();
  const [txDetails, dispatch] = useReducer(reducer, initialState);

  const clear = () => dispatch({ type: 'clear' });

  const send = () => {
    if (
      [TxLifecycle.PENDING, TxLifecycle.INITIALIZED].includes(txDetails.status)
    )
      throw new Error(`
        Cannot send a transaction while another is in progress from the same tx creator
        ${txCreator.toString()}
      `);

    if (!authenticated)
      throw new Error(
        'Cannot send a transaction before maker has finished authenticating'
      );

    clear();

    const txObject = txCreator(maker);
    const sender = maker.currentAddress();
    maker.service('transactionManager').listen(txObject, {
      initialized: () => {
        dispatch({ type: 'initialized', payload: { sender } });
      },
      pending: tx => {
        dispatch({ type: 'pending', payload: { hash: tx.hash } });
      },
      mined: () => {
        dispatch({ type: 'mined' });
      },
      error: (_, err) => {
        dispatch({ type: 'error', payload: { msg: err.message } });
      }
    });
    return txObject;
  };

  return { ...txDetails, ...TxLifecycle, send, clear };
}

export default useMakerTx;
