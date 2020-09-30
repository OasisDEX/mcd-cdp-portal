import React, { createContext, useState } from 'react';
import { useEffect } from 'react';
import useMaker from 'hooks/useMaker';
import { prettifyCurrency } from 'utils/ui';
import useLanguage from 'hooks/useLanguage';
import { uniqueId } from 'utils/dev';
import findIndex from 'lodash/findIndex';
import { txManager } from 'references/config';
import styled from 'styled-components';
const { autoDismissTime, autoDismissFadeoutTime } = txManager;

const ValueText = styled.b`
  font-weight: 600;
`;

const formatTxMessage = (lang, { metadata, ...tx }, state) => {
  const interfaceLocale = lang.getInterfaceLanguage();
  const formatAmount = amount =>
    prettifyCurrency(interfaceLocale, amount.toBigNumber(), 2);
  const type = metadata?.method || metadata?.action?.name;
  const langKey =
    state === 'success' ? 'transactions_past_tense' : 'transactions';
  const suffix =
    state === 'error' && tx.hash
      ? ' failed'
      : state === 'error' && !tx.hash
      ? ' cancelled'
      : '';

  switch (type) {
    case 'safeWipe':
      return lang.formatString(
        `${lang[langKey].pay_back_dai}${suffix}`,
        <ValueText>{formatAmount(metadata.wipeAmount)}</ValueText>
      );
    case 'safeWipeAll':
      return lang.formatString(
        `${lang[langKey].pay_back_dai}${suffix}`,
        'outstanding'
      );
    case 'draw':
      return lang.formatString(
        `${lang[langKey].generate_dai}${suffix}`,
        <ValueText>{formatAmount(metadata.drawAmount)}</ValueText>
      );
    case 'safeLockETH':
    case 'safeLockGem':
      return lang.formatString(
        `${lang[langKey].depositing_gem}${suffix}`,
        <>
          <ValueText>{formatAmount(metadata.lockAmount)}</ValueText>{' '}
          {metadata.lockAmount.symbol}
        </>
      );
    case 'wipeAndFreeETH':
    case 'wipeAndFreeGem':
      return lang.formatString(
        `${lang[langKey].withdrawing_gem}${suffix}`,
        <>
          <ValueText>{formatAmount(metadata.freeAmount)}</ValueText>{' '}
          {metadata.freeAmount.symbol}
        </>
      );
    case 'openLockETHAndDraw':
    case 'openLockGemAndDraw':
      return lang.formatString(
        `${lang[langKey].creating_cdp}${suffix}`
        // <><ValueText>{formatAmount(metadata.lockAmount)}</ValueText> {(lockAmount.symbol)}</>
      );
    case 'lockETHAndDraw':
    case 'lockGemAndDraw':
      return lang.formatString(
        `${lang[langKey].deposit_generate}${suffix}`,
        <>
          <ValueText>{formatAmount(metadata.drawAmount)}</ValueText>{' '}
          {metadata.drawAmount.symbol}
        </>
      );
    case 'transfer':
      return lang.formatString(
        `${lang[langKey].send}${suffix}`,
        <>
          <ValueText>{formatAmount(metadata.action.amount)}</ValueText>{' '}
          {metadata.action.amount.symbol}
        </>,
        <>
          <ValueText>{metadata.action.to.toLowerCase().substr(0, 5)}</ValueText>
          ...
          <ValueText>{metadata.action.to.toLowerCase().substr(-3)}</ValueText>
        </>
      );
    case 'build':
      return lang.formatString(`${lang[langKey].setting_up_proxy}${suffix}`);
    case 'approve':
      return lang.formatString(
        `${lang[langKey].unlocking_token}${suffix}`,
        metadata.contract === 'MCD_DAI' ? 'DAI' : 'token'
      );
    case 'join':
      if (metadata.contract === 'PROXY_ACTIONS_DSR')
        return lang.formatString(
          `${lang[langKey].depositing_gem}${suffix}`,
          'DAI'
        );
      else return '?';
    case 'exit':
      if (metadata.contract === 'PROXY_ACTIONS_DSR')
        return lang.formatString(
          `${lang[langKey].withdrawing_gem}${suffix}`,
          'DAI'
        );
      else return '?';
    case 'exitAll':
      if (metadata.contract === 'PROXY_ACTIONS_DSR')
        return lang.formatString(
          `${lang[langKey].withdrawing_gem}${suffix}`,
          'all DAI'
        );
      else return '?';
    case 'frob':
      if (metadata.contract === 'PROXY_ACTIONS')
        return `${lang[langKey].claiming_collateral}${suffix}`;
      else return '?';
    default:
      return '?';
  }
};

export const TransactionManagerContext = createContext({});

function TransactionManagerProvider({ children }) {
  const { maker } = useMaker();
  const { lang } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [txDrawExpanded, setTxDrawExpanded] = useState(true);

  useEffect(() => {
    if (!maker) return;

    const sub = maker
      .service('transactionManager')
      .onTransactionUpdate((tx, state) => {
        setTxDrawExpanded(true);
        state = state === 'mined' || state === 'finalized' ? 'success' : state;
        const message = formatTxMessage(lang, tx, state);

        if (state === 'initialized') {
          setTransactions(txs => [
            ...txs,
            {
              id: uniqueId(tx._transaction),
              tx,
              state,
              message,
              visible: true,
              pending: true
            }
          ]);
        } else {
          setTransactions(current => {
            const txIdx = findIndex(
              current,
              t => t.id === uniqueId(tx._transaction)
            );
            current[txIdx].state = state;
            current[txIdx].message = message;
            current[txIdx].hash = tx.hash;

            if (state === 'success') current[txIdx].success = true;
            if (state === 'error' && !tx.hash) current[txIdx].rejected = true;
            if (state === 'error' && tx.hash) current[txIdx].failed = true;
            if (state === 'success' || state === 'error')
              current[txIdx].pending = false;

            // Auto dismiss after timeout if tx succeeded or was rejected
            if (state === 'success' || (state === 'error' && !tx.hash)) {
              current[txIdx].pendingRemoval = true;
              setTimeout(() => {
                setTransactions(current => {
                  const txIdx = findIndex(
                    current,
                    t => t.id === uniqueId(tx._transaction)
                  );
                  current[txIdx].visible = false;
                  return [...current];
                });
              }, autoDismissTime + autoDismissFadeoutTime);
            }

            return [...current];
          });
        }
      });

    return () => sub.unsub();
  }, [maker, lang]);

  return (
    <TransactionManagerContext.Provider
      value={{
        transactions,
        setTransactions,
        txDrawExpanded,
        setTxDrawExpanded
      }}
    >
      {children}
    </TransactionManagerContext.Provider>
  );
}

export default TransactionManagerProvider;
