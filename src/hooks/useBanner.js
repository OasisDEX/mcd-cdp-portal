import { useContext } from 'react';
import { BannerStateContext } from 'providers/BannerProvider';

//should show determines if the anchor component displays (if there are any banners to show)
function useBanner() {
  const context = useContext(BannerStateContext);
  const { show, current, shouldShow, reset } = context;
  return { show, current, shouldShow, reset };
}

export default useBanner;
