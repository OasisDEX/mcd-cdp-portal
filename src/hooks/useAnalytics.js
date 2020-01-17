import mixpanel from 'mixpanel-browser';
import { useCurrentRoute } from 'react-navi';
import { Routes } from 'utils/constants';
import references from 'references/config';

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

  const trackBtnClick = (id, additionalProps) => {
    mixpanel.track('btn-click', { id, ...options, ...additionalProps });
  };

  const trackInputChange = (id, additionalProps) => {
    mixpanel.track('input-change', { id, ...options, ...additionalProps });
  };

  return { trackBtnClick, trackInputChange, getProductName, getPageName };
}
