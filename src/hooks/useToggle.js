import { useContext } from 'react';
import { ToggleStateContext } from 'providers/ToggleProvider';

export default function useToggle(id, initialState = false) {
  const { toggleState, updateToggleState } = useContext(ToggleStateContext);

  if (id && toggleState[id] === undefined) {
    updateToggleState({ id, state: initialState });
  }

  return {
    toggle: id ? toggleState[id] : toggleState,
    setToggle: id
      ? newToggleState => updateToggleState({ id, state: !!newToggleState })
      : (existingToggleId, newToggleState) =>
          updateToggleState({ id: existingToggleId, state: !!newToggleState })
  };
}
