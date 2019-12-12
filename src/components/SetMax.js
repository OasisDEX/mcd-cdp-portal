import React from 'react';
import { Text } from '@makerdao/ui-components-core';

import useLanguage from 'hooks/useLanguage';

export default function SetMax({ ...props }) {
  const { lang } = useLanguage();
  return (
    <Text fontWeight="medium" color="blue" cursor="pointer" {...props}>
      {lang.set_max}
    </Text>
  );
}
