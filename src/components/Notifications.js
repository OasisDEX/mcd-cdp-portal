import React from 'react';
import { Text, Card, Button } from '@makerdao/ui-components-core';
import useNotification from 'hooks/useNotification';

function Notifications() {
  const { banners, viewable } = useNotification();
  const bannerEntries = Object.entries(banners);
  return (
    <div>
      {viewable &&
        !!bannerEntries.length &&
        bannerEntries.map(([id, { content }]) => (
          <Card key={id} my="1rem" p="1rem" width="100%">
            <Text>
              {id}: {content}
            </Text>
          </Card>
        ))}
    </div>
  );
}

export default Notifications;
