import React from 'react';
import styled from 'styled-components';
import useLanguage from 'hooks/useLanguage';

const MiddleText = styled.div`
  margin: auto;
  text-align: center;
  width: 100%;
`;

export function CDPTypeNotFound({ cdpTypeSlug }) {
  const { lang } = useLanguage();
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
  const { lang } = useLanguage();
  return (
    <MiddleText>
      <h1>
        <code>404 - {lang.not_found}</code>
      </h1>
    </MiddleText>
  );
}
