import React from 'react';
import { Text, Card } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';

const Ownership = ({ owner }) => {
  const { lang } = useLanguage();
  const message = lang.formatString(
    'The owner of this position {0} does not match the connected wallet address',
    owner
  );

  return (
    <Card my="1rem" p="1rem" width="100%">
      <Text>{message}</Text>
    </Card>
  );
};

export default Ownership;
