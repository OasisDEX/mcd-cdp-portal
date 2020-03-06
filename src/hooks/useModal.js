import { useContext } from 'react';
import { ModalStateContext } from 'providers/ModalProvider';

function useModal() {
  const context = useContext(ModalStateContext);
  const { show, reset, showing } = context;
  const showByType = modalType => show({ modalType });
  return { show, reset, showByType, showing };
}

export default useModal;
