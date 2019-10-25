import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Grid, Stepper, Flex } from '@makerdao/ui-components-core';

const FadeIn = styled.div`
  opacity: 0;
  top: 0;
  position: absolute;
  pointer-events: none;

  ${props =>
    props.active &&
    `
    transform: translateX(0);
    transition: all 0.7s;
    position: relative;
    opacity: 1;
    pointer-events: unset;
  `}

  ${props =>
    props.toLeft &&
    `
    opacity: 0;
    transform: translateX(-50px);
  `}

  ${props =>
    props.toRight &&
    `
    opacity: 0;
    transform: translateX(50px);
  `}
`;

class StepperUI extends React.Component {
  render() {
    // return <Box minHeight="100vh" height="1200px"/>
    return (
      <Grid gridTemplateRows="auto 1fr" gridRowGap="m" mb="xl">
        {this.props.renderStepperHeader()}

        <Grid
          maxWidth="1600px"
          m="0 auto"
          alignItems="start"
          alignContent="start"
          gridRowGap={{ s: 'm', m: '2xl' }}
        >
          <Flex justifyContent="center">
            <Stepper
              minWidth="200px"
              steps={this.props.steps}
              selected={this.props.step}
            />
          </Flex>

          <div
            style={{ width: '100%', maxWidth: '100vw', position: 'relative' }}
          >
            {React.Children.map(this.props.children, (child, index) => {
              return (
                <FadeIn
                  toLeft={index < this.props.step}
                  toRight={index > this.props.step}
                  active={index === this.props.step}
                >
                  {index === this.props.step && child}
                </FadeIn>
              );
            })}
          </div>
        </Grid>
      </Grid>
    );
  }
}

StepperUI.propTypes = {
  /** Whether or not to show onboarding */
  show: PropTypes.bool,
  /** A list of names for each step of the onboarding process */
  steps: PropTypes.arrayOf(PropTypes.string),
  /** Which step the user is currently on. Zero-indexed. */
  step: PropTypes.number,
  /** A callback when the onboarding screen is closed. */
  onClose: PropTypes.func,
  children: PropTypes.arrayOf(PropTypes.element)
};

StepperUI.defaultProps = {
  show: false,
  renderStepperHeader: () => {},
  steps: [],
  step: 0
};

export default StepperUI;
