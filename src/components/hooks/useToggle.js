import { useState } from 'react';

function useToggle() {
  const [bool, setBool] = useState(false);

  function toggle() {
    setBool(bool => !bool);
  }

  return [bool, toggle];
}

export default useToggle;
