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
  const jazziconElement = React.useRef(null);

  function generateJazzicon(_address) {
    removeAllChildNodes(jazziconElement.current);
    const _jazzicon = jazzicon(22, addressAsNumber(_address));
    jazziconElement.current.appendChild(_jazzicon);
  }

  React.useEffect(() => {
    generateJazzicon(address);
  }, [address]);

  return <div ref={jazziconElement} />;
}

export default Jazzicon;
