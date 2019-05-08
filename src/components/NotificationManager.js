import React from 'react';
import { Card } from '@makerdao/ui-components-core';

import useModal from '../hooks/useModal';

const NotificationManager = () => {
  const { show } = useModal();

  return (
    <Card
      p="s"
      mt="s"
      css={{ cursor: 'pointer' }}
      onClick={() =>
        show({ modalType: 'cdpmigrate', modalTemplate: 'fullscreen' })
      }
    >
      2 CDPs to migrate
    </Card>
  );
};

export default NotificationManager;
