import { useContext } from 'react';
import { ModalStateContext } from 'providers/ModalProvider';

function useModal() {
  const { show, reset } = useContext(ModalStateContext);
  const showByType = modalType => show({ modalType });

  return { show, reset, showByType };
}

export default useModal;
