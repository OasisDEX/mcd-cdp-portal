import React from 'react';
import styled from 'styled-components';
import lang from 'languages';

const MiddleText = styled.div`
  margin: auto;
  text-align: center;
  width: 100%;
`;

export function CDPTypeNotFound({ cdpTypeSlug }) {
  return (
    <MiddleText>
      <h1>
        <code>
          {lang.cdp_type} "{cdpTypeSlug.toUpperCase()}" {lang.not_found}
        </code>
      </h1>
    </MiddleText>
  );
}

export function GenericNotFound() {
  return (
    <MiddleText>
      <h1>
        <code>404 - {lang.not_found}</code>
      </h1>
    </MiddleText>
  );
}
