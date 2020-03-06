import { useContext } from 'react';
import findIndex from 'lodash/findIndex';
import { TransactionManagerContext } from '../providers/TransactionManagerProvider';

const useTransactions = () => {
  const {
    transactions,
    setTransactions,
    txDrawExpanded: drawExpanded,
    setTxDrawExpanded: setDrawExpanded
  } = useContext(TransactionManagerContext) || {};

  const hideTransaction = id => {
    setTransactions(current => {
      const index = findIndex(current, t => t.id === id);
      current[index].visible = false;
      return [...current];
    });
  };

  return {
    transactions,
    setTransactions,
    hideTransaction,
    drawExpanded,
    setDrawExpanded
  };
};

export default useTransactions;
