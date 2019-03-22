import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';
import { Box } from '@makerdao/ui-components-core';

import { ReactComponent as LockIcon } from 'images/padlock.svg';
import { ReactComponent as CheckIcon } from 'images/check-small.svg';

/**
 * Toggle switch (on/off) component
 */

const Toggle = styled.div`
  position: relative;
  width: 38px;
  height: 21px;
  border-radius: 15px;
  cursor: pointer;
  display: inline-block;
  background-color: ${({ on }) => (on ? '#1abc9c' : '#ccd6da')};
  transition: background-color 0.2s ease-in-out;
  line-height: 1;
  font-size: 14px;
`;

const StyledToggleSwitch = styled.div`
  position: absolute;
  left: 2px;
  top: 2px;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background-color: #f7f7f7;
  transition: left 0.2s ease-in-out, background-color 0.2s ease-in-out;
  text-align: center;
  svg {
    position: relative;
    top: 1px;
    width: 9px;
    height: 10px;
  }
  ${({ on }) =>
    on
      ? css`
          background-color: #fff;
          left: calc(100% - 19px);
          svg {
            top: 2px;
            width: 9px;
            height: 10px;
          }
        `
      : ''}
`;

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SwitchSpinner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  &:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid transparent;
    border-top-color: ${({ on }) => (on ? '#16927a' : '#1bc4a6')};
    animation: ${rotate} 0.6s ease-in-out infinite;
  }
`;

const Switch = ({ pending, isToggled }) => {
  if (pending) return <SwitchSpinner on={isToggled} />;

  return isToggled ? <CheckIcon /> : <LockIcon />;
};

const ToggleSwitch = ({
  on,
  pending,
  onToggle,
  onClick,
  onDisabledClick,
  enabled,
  auto
}) => {
  const [isOn, setIsOn] = useState(on);
  const isToggled = auto ? isOn : on;

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    if (enabled) {
      auto && setIsOn(!isToggled);
      onClick && onClick(e);
      onToggle && onToggle(!isToggled);
    } else onDisabledClick && onDisabledClick(e);
  };

  return (
    <Box>
      <Toggle on={isToggled} onClick={handleClick}>
        <StyledToggleSwitch on={isToggled}>
          <Switch pending={pending} isToggled={isToggled} />
        </StyledToggleSwitch>
      </Toggle>
    </Box>
  );
};

ToggleSwitch.propTypes = {
  /** The on state of the switch */
  on: PropTypes.bool.isRequired,
  /** Whether or not the component can be clicked and toggled */
  enabled: PropTypes.bool,
  /** Callback called when on state is toggled */
  onToggle: PropTypes.func,
  /** Callback called on click when component is enabled */
  onClick: PropTypes.func,
  /** Callback called on click when component is not enabled */
  onDisabledClick: PropTypes.func,
  /** Handle on/off switch state toggling automatically using hooks */
  auto: PropTypes.bool
};

ToggleSwitch.defaultProps = {
  enabled: true,
  auto: true
};

export default ToggleSwitch;
