import { useCurrentRoute } from 'react-navi';

export default function useCheckRoute() {
  const { url } = useCurrentRoute();
  return {
    isBorrow:
      url.pathname.startsWith('/owner') || /^\/[0-9]+$/.test(url.pathname),
    isSave: url.pathname.startsWith('/legacy/save')
  };
}
