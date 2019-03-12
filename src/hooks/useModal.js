import { useContext } from 'react';
import { ModalStateContext } from 'providers/ModalProvider';

function useModal() {
  const { show, reset } = useContext(ModalStateContext);
  const showType = modalType => show({ modalType });

  return { show, reset, showType };
}

export default useModal;
