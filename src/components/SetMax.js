import React from 'react';
import { Link } from '@makerdao/ui-components-core';

import useLanguage from 'hooks/useLanguage';

export default function SetMax({ ...props }) {
  const { lang } = useLanguage();
  return (
    <Link fontWeight="medium" {...props}>
      {lang.set_max}
    </Link>
  );
}
