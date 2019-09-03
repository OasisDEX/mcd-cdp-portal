import React from 'react';
import { Link } from '@makerdao/ui-components-core';
import lang from 'languages';

export default function SetMax({ ...props }) {
  return (
    <Link fontWeight="medium" {...props}>
      {lang.set_max}
    </Link>
  );
}
