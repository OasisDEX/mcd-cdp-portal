import { useContext } from 'react';
import { ModalStateContext } from 'providers/ModalProvider';

function useModal() {
  const context = useContext(ModalStateContext);
  const { show, reset } = context;
  const showByType = modalType => show({ modalType });
  const showSimpleByType = modalType =>
    show({ modalType, modalTemplate: 'simple' });
  const showFullscreenByType = modalType =>
    show({ modalType, modalTemplate: 'simple' });

  return { show, reset, showByType, showSimpleByType, showFullscreenByType };
}

export default useModal;
