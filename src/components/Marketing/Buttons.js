import styled from 'styled-components';
import { Box } from '@makerdao/ui-components-core';

const Button = styled(Box)`
  border-radius: 40px;
  height: 52px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-family: FT Base;
  font-style: normal;

  font-size: 18px;
  text-align: center;
  letter-spacing: 0.5px;

  transition: opacity 0.1s ease 0s;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const HollowButton = styled(Button)`
  border: 1px solid ${props => props.theme.colors.darkPurple};
  color: ${props => props.theme.colors.darkPurple};
  font-weight: normal;
`;

const FilledButton = styled(Button)`
  background-color: ${props => props.theme.colors.darkPurple};
  color: #ffffff;
  font-weight: bold;
`;

export { HollowButton, FilledButton };
