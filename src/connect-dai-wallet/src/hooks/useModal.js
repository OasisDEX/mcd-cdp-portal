import { useContext } from 'react';
import { ModalStateContext } from 'providers/ModalProvider';

function useModal() {
  const context = useContext(ModalStateContext);
  const { show, reset } = context;
  const showByType = modalType => show({ modalType });
  return { show, reset, showByType };
}

export default useModal;
