import React from 'react';
import { Box } from '@makerdao/ui-components-core';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error.toString() };
  }

  componentDidCatch(error) {
    console.error(error.toString());
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box m={8}>
          <pre>{this.state.errorMsg}</pre>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
