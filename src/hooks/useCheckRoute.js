import { useCurrentRoute, useNavigation } from 'react-navi';

export default function useCheckRoute() {
  const navigation = useNavigation();
  const { url } = useCurrentRoute();
  const cdpRouteRegex = new RegExp(`${navigation.basename}/[0-9]+`);
  return {
    isBorrow:
      url.pathname.startsWith(`${navigation.basename}/owner`) ||
      cdpRouteRegex.test(`${url.pathname}`),
    isSave: url.pathname.startsWith(`${navigation.basename}/legacy/save`)
  };
}
