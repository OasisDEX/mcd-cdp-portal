import React, { Component } from 'react';
import styled from 'styled-components';

import Button from './common/Button';

export const FillSpaceError = styled.div`
  display: flex;
  flex: auto;
  background: ${({ theme }) => theme.bg.default};
  justify-content: center;
  align-items: center;
  flex-direction: column;
  align-self: stretch;
  text-align: center;
  padding: ${props => (props.small ? '16px 12px' : '32px 24px')};
  border-radius: 12px;
`;

export const Heading = styled.h3`
  font-size: ${props => (props.small ? '18px' : '24px')};
  font-weight: ${props => (props.small ? '500' : '600')};
  color: ${props => props.theme.text.default};
  max-width: 600px;
  margin-bottom: 8px;
`;

export const Subheading = styled.h4`
  font-size: ${props => (props.small ? '14px' : '18px')};
  font-weight: ${props => (props.small ? '400' : '500')};
  line-height: 1.4;
  color: ${({ theme }) => theme.text.alt};
  max-width: 540px;
  margin-bottom: ${props => (props.small ? '16px' : '32px')};
`;

class ErrorBoundary extends Component {
  state = { error: false };

  componentDidCatch(error) {
    this.setState({ error });
    console.error(error);
  }

  render() {
    if (this.state.error) {
      return (
        <FillSpaceError>
          <Heading>Something went wrong</Heading>
          <Subheading>
            Sorry about that, the Maker team has been notified and should
            resolve it shortly.
          </Subheading>
          <Button
            icon="view-reload"
            onClick={() => window.location.reload(true)}
          >
            Refresh the page
          </Button>
        </FillSpaceError>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
