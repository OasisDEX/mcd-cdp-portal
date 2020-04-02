import React from 'react';
import { Flex, Box, Text } from '@makerdao/ui-components-core';
import styled from 'styled-components';

const IconBox = styled(Box)`
  display: flex;
  align-items: center;
  &,
  svg,
  img {
    width: ${props => props.size};
    height: ${props => props.size};
  }
`;

const IconButtonStyle = styled(Box)`
  width: 255px;
  padding: 12px 26px 12px;
  cursor: pointer;

  .text {
    margin-left: 23px;
  }

  :hover .text {
    opacity: 0.6;
  }
`;

const IconButton = ({ icon, iconSize = '26.67px', children, ...props }) => {
  return (
    <IconButtonStyle {...props}>
      <Flex alignItems="center" justifyContent="flex-start" height="32px">
        <IconBox size={iconSize}>{icon}</IconBox>
        <Text className="text">{children}</Text>
      </Flex>
    </IconButtonStyle>
  );
};

export default IconButton;
