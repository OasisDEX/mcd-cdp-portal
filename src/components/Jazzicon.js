import React from 'react';
import jazzicon from 'jazzicon';

import { addressAsNumber } from 'utils/ethereum';

function removeAllChildNodes(element) {
  if (!element || !element.firstChild) return;
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function Jazzicon({ address }) {
  const jazziconEl = React.useRef(null);

  function generateJazzicon(_address) {
    removeAllChildNodes(jazziconEl.current);
    const _jazzicon = jazzicon(22, addressAsNumber(_address));
    jazziconEl.current.appendChild(_jazzicon);
  }

  React.useEffect(() => generateJazzicon(address), [address]);

  return <div ref={jazziconEl} />;
}

export default Jazzicon;
