import React, { useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { Box, Flex, Text } from '@makerdao/ui-components-core';
import styled from 'styled-components';
import AccountSelection from 'components/AccountSelection';
import useLanguage from 'hooks/useLanguage';
import OasisLogoLink from './OasisLogoLink';

const HeaderStyle = styled(Box)`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 89px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
  background-color: #fff;
  padding: 0 121px 0 119px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
`;

const Header = () => {
  const { lang } = useLanguage();

  return (
    <HeaderStyle>
      <OasisLogoLink />
      <Flex alignItems="center">
        <Text display={{ s: 'none', xl: 'inline' }}>
          {lang.providers.connect_wallet_long}
        </Text>
        <AccountSelection ml="24px" buttonWidth="248px" display="inline" />
      </Flex>
    </HeaderStyle>
  );
};

// Shows a fixed header when children are not in viewport
const FixedHeaderTrigger = ({ children, ...props }) => {
  const [showHeader, setShowHeader] = useState(false);

  return (
    <VisibilitySensor
      onChange={isVisible => setShowHeader(!isVisible)}
      partialVisibility={true}
      {...props}
    >
      <div>
        {showHeader && <Header />}
        {children}
      </div>
    </VisibilitySensor>
  );
};

export default FixedHeaderTrigger;
