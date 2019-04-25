import React from 'react';
import { Flex, Grid, Box, Text } from '@makerdao/ui-components-core';
import WalletSelection from './WalletSelection';
import useMaker from 'hooks/useMaker';
import { ReactComponent as CloseIcon } from 'images/close-circle.svg';

const StepperHeader = ({ onClose }) => {
  const { account } = useMaker();
  return (
    <Flex justifyContent="flex-end" alignItems="center" mr="xl" mb="m">
      <Grid
        gridColumnGap="l"
        gridTemplateColumns="auto auto auto"
        alignItems="center"
      >
        <Box width="auto">
          <WalletSelection
            currentAccount={account}
            textColor="steel"
            t="1.6rem"
            readOnly
          />
        </Box>

        <Grid
          onClick={onClose}
          gridTemplateColumns="auto auto"
          alignItems="center"
          gridColumnGap="xs"
          css={{ cursor: 'pointer' }}
        >
          <CloseIcon />
          <Text color="steel" t="1.6rem" fontWeight="medium">
            Close
          </Text>
        </Grid>
      </Grid>
    </Flex>
  );
};

export default StepperHeader;
