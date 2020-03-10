import mixpanel from 'mixpanel-browser';
import { useCurrentRoute } from 'react-navi';
import { Routes } from 'utils/constants';
import references from 'references/config';

const env = process.env.NODE_ENV === 'production' ? 'prod' : 'test';
const fathomGoals = {
  test: {
    connectWallet: 'HDM3M0GY',
    openVault: 'ZPIAXGPD',
    vaultDeposit: 'L7FMVIJF',
    vaultWithdraw: 'JXEAHVCQ',
    vaultPayback: 'BN3W47XO',
    vaultGenerate: 'PA1BAWGN',
    saveDeposit: 'PYNWBWXG',
    saveWithdraw: 'E33XOIJF'
  },
  prod: {
    connectWallet: 'HSZ7AZRX',
    openVault: 'WQ93FHFH',
    vaultDeposit: 'WEDKMXEL',
    vaultWithdraw: 'QX9564XL',
    vaultPayback: 'PLFXEPS3',
    vaultGenerate: 'CPXGZTYI',
    saveDeposit: 'HZP70W8E',
    saveWithdraw: 'QOFRJW54'
  }
}[env];

export default function useAnalytics(section, page = null, product = null) {
  const { url, title } = useCurrentRoute();

  const getPageName = title => {
    return references.trackingPages[title] || title;
  };

  const getProductName = pathname => {
    return pathname.startsWith(`/${Routes.BORROW}`)
      ? 'Borrow'
      : pathname.startsWith(`/${Routes.SAVE}`)
      ? 'Save'
      : pathname;
  };

  const options = {
    section,
    page: page || getPageName(title),
    product: product || getProductName(url.pathname)
  };

  const trackBtnClick = (id, additionalProps = {}) => {
    const { fathom } = additionalProps;
    if (fathom) {
      // Fathom interprets 'amount' in cents, multiply by 100 to get dollars
      window.fathom(
        'trackGoal',
        fathomGoals[fathom.id],
        fathom.amount * 100 || 0
      );
      delete additionalProps.fathomConf;
    }
    mixpanel.track('btn-click', { id, ...options, ...additionalProps });
  };

  const trackInputChange = (id, additionalProps) => {
    mixpanel.track('input-change', { id, ...options, ...additionalProps });
  };

  return { trackBtnClick, trackInputChange };
}
