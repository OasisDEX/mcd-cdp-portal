import React from 'react';
import { Flex, Text } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';

const Unavailable = () => {
  const { lang } = useLanguage();
  return (
    <Flex
      height="70vh"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Text.p t="h4" mb="s">
        {lang.overview_page.vault_unavailable}
      </Text.p>
    </Flex>
  );
};

export default Unavailable;
