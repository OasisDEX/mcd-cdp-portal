import React from 'react';

export function CDPTypeNotFound({ cdpTypeSlug }) {
  return (
    <div>
      <h2>CDP type {cdpTypeSlug} not found</h2>
    </div>
  );
}

export function GenericNotFound() {
  return (
    <div>
      <h1>404 - Not Found</h1>
    </div>
  );
}
