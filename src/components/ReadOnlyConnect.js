import React from 'react';
import { Link, useNavigation } from 'react-navi';

import { Button } from '@makerdao/ui-components-core';
import { Routes } from 'utils/constants';
import useLanguage from 'hooks/useLanguage';

function ReadOnlyConnect() {
  const { lang } = useLanguage();
  const navigation = useNavigation();
  return (
    <Link href={`${navigation.basename}/$/${Routes.BORROW}/`} prefetch={true}>
      <Button variant="secondary-outline" width="225px">
        {lang.landing_page.read_only}
      </Button>
    </Link>
  );
}

export default ReadOnlyConnect;
