import styled from 'styled-components';
import { Box } from '@makerdao/ui-components-core';

const Button = styled(Box)`
  border-radius: 40px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-family: FT Base;
  font-style: normal;
  font-size: 16px;
  line-height: 18px;
  text-align: center;
  letter-spacing: 0.5px;

  transition: background-color 0.1s ease 0s;
  cursor: pointer;
`;

const HollowButton = styled(Button)`
  border: 1px solid ${props => props.theme.colors.darkPurple};
  color: ${props => props.theme.colors.darkPurple};
  font-weight: bold;
`;

const FilledButton = styled(Button)`
  background-color: ${props => props.theme.colors.darkPurple};
  color: #ffffff;
  font-weight: bold;

  :hover {
    background-color: #50445e;
  }
`;

export { HollowButton, FilledButton };
