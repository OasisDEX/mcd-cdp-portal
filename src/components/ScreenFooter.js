import React from 'react';
import { Button, Flex } from '@makerdao/ui-components-core';

import useLanguage from 'hooks/useLanguage';

const ScreenFooter = ({
  onNext,
  onBack,
  loading,
  canGoBack = true,
  canProgress = true,
  continueText = lang.actions.continue,
  secondaryButtonText = lang.actions.back
} = {}) => {
  const { lang } = useLanguage();
  return (
    <Flex textAlign="center" justifyContent="center">
      <Button
        disabled={!canGoBack}
        width="110px"
        variant="secondary-outline"
        mx="xs"
        onClick={onBack}
      >
        {secondaryButtonText}
      </Button>
      <Button
        disabled={!canProgress}
        loading={loading}
        width="145px"
        mx="xs"
        onClick={onNext}
      >
        {continueText}
      </Button>
    </Flex>
  );
};

export default ScreenFooter;
