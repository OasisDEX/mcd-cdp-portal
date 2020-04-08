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

  z-index: 1000;
`;

const HeaderContent = styled(Box)`
  margin: 0 auto;
  max-width: 1280px;
  padding: 0 40px;

  @media only screen and (max-width: 425px) {
    padding: 0 10px;
  }

  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Header = () => {
  const { lang } = useLanguage();

  return (
    <HeaderStyle>
      <HeaderContent>
        <OasisLogoLink />
        <Flex alignItems="center">
          <Text display={{ s: 'none', xl: 'inline' }} fontSize="19px">
            {lang.providers.connect_wallet_long}
          </Text>
          <AccountSelection ml="24px" buttonWidth="248px" display="inline" />
        </Flex>
      </HeaderContent>
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
