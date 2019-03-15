import { useContext } from 'react';
import { ModalStateContext } from 'providers/ModalProvider';

function useModal() {
  console.log('use modal');
  console.log('modal state context', ModalStateContext);
  const context = useContext(ModalStateContext);
  console.log('scontext', context);
  const { show, reset } = context;
  const showByType = modalType => show({ modalType });

  return { show, reset, showByType };
}

export default useModal;
