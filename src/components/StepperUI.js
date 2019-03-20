import React, { Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Grid, Stepper } from '@makerdao/ui-components-core';

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
    return (
      <Fragment>
        {this.props.renderStepperHeader()}

        <Grid maxWidth="1600px" m="0 auto">
          <Stepper
            style={{ margin: '0 auto' }}
            steps={this.props.steps}
            selected={this.props.step}
          />
          <div style={{ width: '100%', position: 'relative' }}>
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
      </Fragment>
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
  children: PropTypes.element
};

StepperUI.defaultProps = {
  show: false,
  renderStepperHeader: () => {},
  steps: [],
  step: 0
};

export default StepperUI;
