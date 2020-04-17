import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Patty = styled.span``;

const HamburgerBun = styled.div`
  width: 22px;
  height: 16px;
  padding: 2px;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
  cursor: pointer;

  & > div {
    position: relative;
  }

  span {
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    background: ${props => props.theme.header.linkHeaderColor};
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;

    &:nth-child(1) {
      top: 0px;
      transform-origin: left center;
    }

    &:nth-child(2) {
      top: 6px;
      width: 14px;
      left: unset;
      right: 4px;
      transform-origin: left center;
    }

    &:nth-child(3) {
      top: 12px;
      transform-origin: left center;
    }

    ${props =>
      props.isCross &&
      `
      &:nth-child(1) {
        transform: rotate(45deg);
        width: 23px;
        left: 0px;
        top: -2px;
      }

      &:nth-child(2) {
        width: 0%;
        opacity: 0;
      }

      &:nth-child(3) {
        transform: rotate(-45deg);
        width: 23px;
        left: 0px;
        top: 14px;
      }
    `}
  }
`;

const Hamburger = styled(({ active, ...props }) => {
  return (
    <HamburgerBun isCross={active} {...props}>
      <div>
        <Patty />
        <Patty />
        <Patty />
      </div>
    </HamburgerBun>
  );
})``;

Hamburger.propTypes = {
  active: PropTypes.bool
};

export default Hamburger;
