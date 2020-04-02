import React from 'react';
import { Flex, Box, Text } from '@makerdao/ui-components-core';
import styled from 'styled-components';

const IconBox = styled(Box)`
  & > svg {
    display: inline-block;
    width: ${props => props.size};
    height: ${props => props.size};
  }
  width: ${props => props.size};
  text-align: center;
`;

const IconButtonStyle = styled(Box)`
  width: 255px;
  padding: 16px 26px;
  cursor: pointer;

  .text {
    margin-left: 22px;
  }

  :hover .text {
    opacity: 0.6;
  }
`;

const IconButton = ({ icon, children, ...props }) => {
  return (
    <IconButtonStyle {...props}>
      <Flex alignItems="center" justifyContent="flex-start" height="27px">
        <IconBox size="32px">{icon}</IconBox>
        <Text className="text">{children}</Text>
      </Flex>
    </IconButtonStyle>
  );
};

export default IconButton;
