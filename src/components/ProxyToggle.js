import React from 'react';

import useLanguage from 'hooks/useLanguage';
import LoadingToggle from 'components/LoadingToggle';

export default function ProxyToggle(props) {
  const { lang } = useLanguage();
  return (
    <LoadingToggle
      completeText={lang.action_sidebar.proxy_created}
      loadingText={lang.action_sidebar.creating_proxy}
      defaultText={lang.action_sidebar.create_proxy}
      {...props}
    />
  );
}
