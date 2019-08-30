import React from 'react';
import lang from 'languages';

import LoadingToggle from 'components/LoadingToggle';

export default function AllowanceToggle({ tokenDisplayName, ...props }) {
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
