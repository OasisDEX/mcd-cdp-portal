import { useContext } from 'react';
import { BannerStateContext } from 'providers/BannerProvider';

//should show determines if the anchor component displays (if there are any banners to show)
function useModal() {
  const context = useContext(BannerStateContext);
  const { show, current, shouldShow, activeBanners, banners, reset } = context;
  return { show, current, shouldShow, activeBanners, banners, reset };
}

export default useModal;
