import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Patty = styled.span``;

const HamburgerBun = styled.div`
  width: 20px;
  height: 16px;
  position: relative;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
  cursor: pointer;

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
      top: 7px;
      transform-origin: left center;
    }

    &:nth-child(3) {
      top: 14px;
      transform-origin: left center;
    }

    ${props =>
      props.isCross &&
      `
      &:nth-child(1) {
        transform: rotate(45deg);
        left: 0px;
      }

      &:nth-child(2) {
        width: 0%;
        opacity: 0;
      }

      &:nth-child(3) {
        transform: rotate(-45deg);
        left: 0px;
      }
    `}
  }
`;

const Hamburger = ({ active }) => {
  return (
    <HamburgerBun isCross={active}>
      <Patty />
      <Patty />
      <Patty />
    </HamburgerBun>
  );
};

Hamburger.propTypes = {
  active: PropTypes.bool,
};

export default Hamburger;
