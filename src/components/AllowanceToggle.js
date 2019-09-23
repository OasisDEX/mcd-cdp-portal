import React from 'react';

import useLanguage from 'hooks/useLanguage';
import LoadingToggle from 'components/LoadingToggle';

export default function AllowanceToggle({ tokenDisplayName = '', ...props }) {
  const { lang } = useLanguage();
  return (
    <LoadingToggle
      completeText={lang.formatString(
        lang.action_sidebar.token_unlocked,
        tokenDisplayName
      )}
      loadingText={lang.formatString(
        lang.action_sidebar.unlocking_token,
        tokenDisplayName
      )}
      defaultText={lang.formatString(
        lang.action_sidebar.unlock_token,
        tokenDisplayName
      )}
      {...props}
    />
  );
}
