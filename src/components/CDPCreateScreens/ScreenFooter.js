import React from 'react';
import { Button, Flex } from '@makerdao/ui-components-core';

import lang from 'languages';

const ScreenFooter = ({
  dispatch,
  loading,
  canGoBack = true,
  canProgress = true,
  continueText = lang.actions.continue
} = {}) => {
  return (
    <Flex textAlign="center" justifyContent="center">
      <Button
        disabled={!canGoBack}
        width="110px"
        variant="secondary-outline"
        mx="xs"
        onClick={() => dispatch({ type: 'decrement-step' })}
      >
        {lang.actions.back}
      </Button>
      <Button
        disabled={!canProgress}
        loading={loading}
        width="145px"
        mx="xs"
        onClick={() => dispatch({ type: 'increment-step' })}
      >
        {continueText}
      </Button>
    </Flex>
  );
};

export default ScreenFooter;
