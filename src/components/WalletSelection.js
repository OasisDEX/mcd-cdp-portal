import React from 'react';
import { cutMiddle } from 'utils/ui';
import { Flex, Text, Box } from '@makerdao/ui-components-core';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { ReactComponent as CaratDownIcon } from 'images/carat-down.svg';

const WalletSection = ({
  currentAccount,
  address,
  textColor = 'black2',
  iconSize = 22,
  t = 'p5'
}) => {
  return (
    <Flex alignItems="center">
      <Jazzicon diameter={iconSize} seed={jsNumberForAddress(address)} />
      {!currentAccount ? null : (
        <Box ml="s" mr="auto">
          <Text t={t} color={textColor}>
            {currentAccount ? currentAccount.type : null}
          </Text>
        </Box>
      )}
      <Box ml="m">
        <Text t={t} color={textColor}>
          {cutMiddle(address, 7, 5)}
        </Text>
      </Box>
      <Box ml="xs" mb="2px">
        <CaratDownIcon />
      </Box>
    </Flex>
  );
};

export default WalletSection;
