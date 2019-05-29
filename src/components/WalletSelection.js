import React from 'react';
import lang from 'languages';
import { Flex, Text, Box } from '@makerdao/ui-components-core';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import { ReactComponent as CaratDownIcon } from 'images/carat-down.svg';

import { getWebClientProviderName } from 'utils/web3';
import { cutMiddle } from 'utils/ui';
import WalletConnectDropdown from 'components/WalletConnectDropdown';

const WalletSection = ({
  currentAccount,
  textColor = 'darkPurple',
  iconSize = 22,
  t = 'body',
  addressTextStyle = 'body',
  readOnly,
  ...rest
}) => {
  const { address, type } = currentAccount;
  if (!currentAccount) return null;
  const providerType =
    type === 'browser' ? getWebClientProviderName(type) : type;
  return (
    <WalletConnectDropdown>
      <Flex alignItems="center" {...rest}>
        <Jazzicon diameter={iconSize} seed={jsNumberForAddress(address)} />
        <Box ml="xs" mr="auto">
          <Text t={t} color={textColor}>
            {lang.providers[providerType]}
          </Text>
        </Box>
        <Box ml="s">
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
    </WalletConnectDropdown>
  );
};

export default WalletSection;
