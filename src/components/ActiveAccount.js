import React from 'react';
import { Flex, Text, Box } from '@makerdao/ui-components-core';

import { getWebClientProviderName } from 'utils/web3';
import { cutMiddle } from 'utils/ui';
import useLanguage from 'hooks/useLanguage';

import { ReactComponent as CaratDownIcon } from 'images/carat-down.svg';

const ActiveAccount = ({
  address,
  type,
  textColor = 'darkPurple',
  iconSize = 22,
  t = 'body',
  addressTextStyle = 'body',
  readOnly,
  ...rest
}) => {
  const { lang } = useLanguage();
  const providerType =
    type === 'browser' ? getWebClientProviderName(type) : type;
  return (
    <Flex justifyContent="space-between" alignItems="center" {...rest}>
      <Text
        pr="xs"
        fontSize="0.8rem"
        color={address ? 'makerTeal' : 'makerOrange'}
      >
        &#11044;
      </Text>

      <Box ml="xs" mr="auto">
        <Text t={t} color={textColor}>
          {address ? lang.providers[providerType] : lang.sidebar.no_wallet}
        </Text>
      </Box>
      <Box ml="s">
        {address ? (
          <Text t={addressTextStyle} color={textColor}>
            {cutMiddle(address, 7, 5)}
          </Text>
        ) : null}
      </Box>
      {readOnly ? null : (
        <Box ml="xs" mb="2px">
          <CaratDownIcon />
        </Box>
      )}
    </Flex>
  );
};

export default ActiveAccount;
