import React from 'react';
import styled from 'styled-components';

const MiddleText = styled.div`
  margin: auto;
  text-align: center;
  width: 100%;
`;

export function CDPTypeNotFound({ cdpTypeSlug }) {
  return (
    <MiddleText>
      <h1>
        <code>CDP Type "{cdpTypeSlug.toUpperCase()}" Not Found</code>
      </h1>
    </MiddleText>
  );
}

export function GenericNotFound() {
  return (
    <MiddleText>
      <h1>
        <code>404 - Not Found</code>
      </h1>
    </MiddleText>
  );
}
