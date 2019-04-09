import React from 'react';
import { cutMiddle } from 'utils/ui';
import { Flex, Text, Box } from '@makerdao/ui-components-core';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { ReactComponent as CaratDownIcon } from 'images/carat-down.svg';

const WalletSection = ({
  currentAccount,
  textColor = 'black2',
  iconSize = 22,
  t = 'body',
  addressTextStyle = 'textS',
  readOnly
}) => {
  if (!currentAccount) return null;
  const { address, type } = currentAccount;
  return (
    <Flex alignItems="center">
      <Jazzicon diameter={iconSize} seed={jsNumberForAddress(address)} />
      <Box ml="xs" mr="auto">
        <Text t={t} color={textColor}>
          {type}
        </Text>
      </Box>
      <Box ml="m">
        <Text t={addressTextStyle} color={textColor}>
          {cutMiddle(address, 7, 5)}
        </Text>
      </Box>
      {readOnly ? null : (
        <Box ml="xs" mb="2px">
          <CaratDownIcon />
        </Box>
      )}
    </Flex>
  );
};

export default WalletSection;
