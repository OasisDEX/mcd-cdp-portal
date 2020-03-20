import mixpanel from 'mixpanel-browser';
import { useCurrentRoute } from 'react-navi';
import { Routes } from 'utils/constants';
import references from 'references/config';

const env = process.env.NODE_ENV === 'production' ? 'prod' : 'test';
const fathomGoals = {
  test: {
    connectWallet: 'HDM3M0GY',
    ETHVaultDeposit: 'TEZECNXD',
    ETHVaultWithdraw: 'NLXKLFB0',
    ETHVaultPayback: 'MUOTJQBT',
    ETHVaultGenerate: 'RNETPMAI',
    BATVaultDeposit: '79HIQJYY',
    BATVaultWithdraw: 'EWFRWHQF',
    BATVaultPayback: 'J7LCT5MR',
    BATVaultGenerate: 'NKEQFMM9',
    USDCVaultDeposit: 'UVIG1MBQ',
    USDCVaultWithdraw: '2MBIXK34',
    USDCVaultPayback: 'MOSFNWOM',
    USDCVaultGenerate: '5NXLJ2ZN',
    saveDeposit: 'PYNWBWXG',
    saveWithdraw: 'E33XOIJF',
    openETHVaultDraw: 'QGVJSAAV',
    openETHVaultLock: 'Q6UC3LYV',
    openBATVaultDraw: 'X5RCGZXR',
    openBATVaultLock: 'VJLUZIYC',
    openUSDCVaultDraw: 'Q8AWKLIZ',
    openUSDCVaultLock: 'VKR8JNQ4'
  },
  prod: {
    connectWallet: 'HSZ7AZRX',
    ETHVaultDeposit: 'EXMETZQL',
    ETHVaultWithdraw: 'NSCIPQVS',
    ETHVaultPayback: 'UZFZZTM0',
    ETHVaultGenerate: 'OUBOEVS8',
    BATVaultDeposit: 'QWUJWV5S',
    BATVaultWithdraw: '9RRSG9IN',
    BATVaultPayback: '9DA6DXTL',
    BATVaultGenerate: 'DWIZTBPQ',
    USDCVaultDeposit: 'YQREX5ZA',
    USDCVaultWithdraw: '5QTQNT62',
    USDCVaultPayback: 'RCUL7HVD',
    USDCVaultGenerate: 'XW8MTQ2H',
    saveDeposit: 'HZP70W8E',
    saveWithdraw: 'QOFRJW54',
    openETHVaultDraw: 'H1VSU5CI',
    openETHVaultLock: 'D4ZV2V4Y',
    openBATVaultDraw: 'GDPZ3L0Z',
    openBATVaultLock: '3GOF3WFX',
    openUSDCVaultDraw: '6IPC7OMM',
    openUSDCVaultLock: 'ZDFJQEFO'
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
