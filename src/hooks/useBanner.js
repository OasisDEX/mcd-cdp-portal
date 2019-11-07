import { useContext } from 'react';
import { BannerStateContext } from 'providers/BannerProvider';

function useModal() {
  const context = useContext(BannerStateContext);
  const { show, current, shouldShow } = context;
  return { show, current, shouldShow };
}

export default useModal;
