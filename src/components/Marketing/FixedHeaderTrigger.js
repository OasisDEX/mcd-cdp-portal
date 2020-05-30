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
  height: 81px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
  background-color: #fff;

  z-index: -1;
  opacity: 0;

  transition: opacity 0.15s ease;

  .cta-container {
    transition: transform 0.15s ease-out;
    transform: translateX(-30px);
  }

  &.visible {
    z-index: 10;
    opacity: 1;
    .cta-container {
      transform: translateX(0);
    }
  }
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

const Header = ({ cta, ...props }) => {
  const { lang } = useLanguage();

  const defaultCTA = (
    <Flex alignItems="center" className="selector-container">
      <Text display={{ s: 'none', xl: 'inline' }} fontSize="s">
        {lang.providers.connect_wallet_long}
      </Text>
      <AccountSelection ml="24px" buttonWidth="248px" display="inline" />
    </Flex>
  );

  return (
    <HeaderStyle {...props}>
      <HeaderContent>
        <OasisLogoLink />
        <div className="cta-container">{cta || defaultCTA}</div>
      </HeaderContent>
    </HeaderStyle>
  );
};

// Shows a fixed header when children are not in viewport
const FixedHeaderTrigger = ({ cta, children, ...props }) => {
  const [show, setShow] = useState(false);

  return (
    <VisibilitySensor
      onChange={isVisible => setShow(!isVisible)}
      partialVisibility={true}
      {...props}
    >
      <div>
        <Header cta={show ? cta : <div />} className={show ? 'visible' : ''} />
        {children}
      </div>
    </VisibilitySensor>
  );
};

export default FixedHeaderTrigger;
