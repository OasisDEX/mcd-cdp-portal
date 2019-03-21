import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Toggle switch (on/off) component
 */

const tickIcon = (
  <svg
    className="tick"
    width="8"
    height="8"
    viewBox="0 0 8 8"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m12.9537037 31.287037-4.83333333 4.8333334c-.04321009.0308643-.08333315.0462963-.12037037.0462963s-.07716028-.015432-.12037037-.0462963l-2.83333333-2.8333334c-.08024732-.0802473-.08024732-.1604934 0-.2407407l1.16666666-1.1666667c.08024732-.0802473.16049343-.0802473.24074074 0l1.5462963 1.5555556 3.5462963-3.5555556c.0802473-.0802473.1604934-.0802473.2407407 0l1.1666667 1.1666667c.0802473.0802473.0802473.1604934 0 .2407407z"
      fillRule="evenodd"
      transform="translate(-5.006945 -28.993055)"
    />
  </svg>
);
const lockIcon = (
  <svg
    className="padlock"
    width="7"
    height="9"
    viewBox="0 0 7 9"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m12.65625 9.21728516c.1358031 0 .2530859.04938222.3518519.14814814.0987659.09876593.1481481.21604871.1481481.35185186v3.50000004c0 .1358031-.0493822.2530859-.1481481.3518518-.098766.0987659-.2160488.1481482-.3518519.1481482h-5c-.13580315 0-.25308593-.0493823-.35185185-.1481482-.09876593-.0987659-.14814815-.2160487-.14814815-.3518518v-3.50000004c0-.13580315.04938222-.25308593.14814815-.35185186.09876592-.09876592.2160487-.14814814.35185185-.14814814h.5v-1.5c0-.54938547.19598569-1.02005977.58796296-1.41203704s.86265158-.58796296 1.41203704-.58796296c.5493855 0 1.0200598.19598569 1.412037.58796296.3919773.39197727.587963.86265157.587963 1.41203704v1.5zm-3.5-1.5v1.5h2v-1.5c0-.27777917-.0972213-.51388792-.2916667-.70833334-.1944454-.19444541-.4305541-.29166666-.7083333-.29166666-.27777917 0-.51388792.09722125-.70833333.29166666-.19444542.19444542-.29166667.43055417-.29166667.70833334z"
      fillRule="evenodd"
      transform="translate(-7 -5)"
    />
  </svg>
);

const ToggleSwitch = ({
  on,
  pending,
  onToggle,
  onClick,
  onDisabledClick,
  enabled,
  auto
}) => {
  const [onState, setOnState] = useState(on);
  const onStateUse = auto ? onState : on;
  const classes = [
    'switch',
    onStateUse ? 'on ' : '',
    enabled ? '' : 'disabled '
  ].join(' ');
  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    if (enabled) {
      auto && setOnState(!onStateUse);
      onClick && onClick(e);
      onToggle && onToggle(!onStateUse);
    } else onDisabledClick && onDisabledClick(e);
  };
  return (
    <ToggleSwitchWrapper>
      <div className={classes} onClick={handleClick}>
        <div className="toggle-switch">
          {onStateUse ? (
            pending ? (
              <div className="switch-spinner" />
            ) : (
              tickIcon
            )
          ) : pending ? (
            <div className="switch-spinner" />
          ) : (
            lockIcon
          )}
        </div>
      </div>
    </ToggleSwitchWrapper>
  );
};

const ToggleSwitchWrapper = styled.div`
  .switch {
    position: relative;
    width: 38px;
    height: 21px;
    border-radius: 15px;
    cursor: pointer;
    display: inline-block;
    background-color: #ccd6da;
    transition: background-color 0.2s ease-in-out;
    line-height: 1;
    font-size: 14px;
    &.on {
      background-color: #1abc9c;
      & .toggle-switch {
        background-color: #fff;
        left: calc(100% - 19px);
        svg {
          top: 2px;
          width: 9px;
          height: 10px;
        }
      }
      .switch-spinner:before {
        border-top-color: #16927a;
      }
    }
    &.disabled {
      cursor: not-allowed;
    }
    .toggle-switch {
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
    }
    @keyframes switch-spinner {
      to {
        transform: rotate(360deg);
      }
    }
    .switch-spinner {
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
        border-top-color: #1bc4a6;
        animation: switch-spinner 0.6s ease-in-out infinite;
      }
    }
    svg.tick path {
      fill: #1abc9c;
    }
    svg.padlock path {
      fill: #9db6bf;
    }
  }
`;

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
