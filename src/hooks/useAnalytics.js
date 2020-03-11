import mixpanel from 'mixpanel-browser';
import { useCurrentRoute } from 'react-navi';
import { Routes } from 'utils/constants';
import references from 'references/config';

const env = process.env.NODE_ENV === 'production' ? 'prod' : 'test';
const fathomGoals = {
  test: {
    connectWallet: 'HDM3M0GY',
    vaultDeposit: 'L7FMVIJF',
    vaultWithdraw: 'JXEAHVCQ',
    vaultPayback: 'BN3W47XO',
    vaultGenerate: 'PA1BAWGN',
    saveDeposit: 'PYNWBWXG',
    saveWithdraw: 'E33XOIJF',
    openETHVaultDraw: 'QGVJSAAV',
    openETHVaultLock: 'Q6UC3LYV',
    openBATVaultDraw: 'X5RCGZXR',
    openBATVaultLock: 'VJLUZIYC'
  },
  prod: {
    connectWallet: 'HSZ7AZRX',
    vaultDeposit: 'WEDKMXEL',
    vaultWithdraw: 'QX9564XL',
    vaultPayback: 'PLFXEPS3',
    vaultGenerate: 'CPXGZTYI',
    saveDeposit: 'HZP70W8E',
    saveWithdraw: 'QOFRJW54',
    openETHVaultDraw: 'H1VSU5CI',
    openETHVaultLock: 'D4ZV2V4Y',
    openBATVaultDraw: 'GDPZ3L0Z',
    openBATVaultLock: '3GOF3WFX'
  }
}[env];

export default function useAnalytics(section, page = null, product = null) {
  const { url, title } = useCurrentRoute();

  const getPageName = title => {
    return references.trackingPages[title] || title;
  };

  // Fathom interprets 'amount' in cents, multiply by 100 to get dollars
  const trackFathomGoal = goal =>
    window.fathom('trackGoal', fathomGoals[goal.id], goal.amount * 100 || 0);

  const getProductName = pathname => {
    return pathname.startsWith(`/${Routes.BORROW}`)
      ? 'Borrow'
      : pathname.startsWith(`/${Routes.SAVE}`)
      ? 'Save'
      : pathname;
  };

  const mixpanelOptions = {
    section,
    page: page || getPageName(title),
    product: product || getProductName(url.pathname)
  };

  const trackBtnClick = (id, additionalProps = {}) => {
    const { fathom } = additionalProps;
    if (fathom) {
      if (Array.isArray(fathom)) fathom.forEach(goal => trackFathomGoal(goal));
      else trackFathomGoal(fathom);
      delete additionalProps.fathom;
    }
    mixpanel.track('btn-click', { id, ...mixpanelOptions, ...additionalProps });
  };

  const trackInputChange = (id, additionalProps) => {
    mixpanel.track('input-change', {
      id,
      ...mixpanelOptions,
      ...additionalProps
    });
  };

  return { trackBtnClick, trackInputChange };
}
