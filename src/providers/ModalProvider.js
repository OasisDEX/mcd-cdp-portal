import React, { createContext, useReducer } from 'react';

function resolveModalTypeToComponent(modals, type) {
  if (!modals || !type || !modals[type]) return null;

  return modals[type];
}

const initialState = {
  modalType: '',
  modalProps: {},
  modalTemplate: ''
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'show':
      return { ...state, ...payload };
    case 'reset':
      return { ...initialState };
    default:
      return;
  }
};

const ModalStateContext = createContext(initialState);

function resolveModalTemplateToComponent(templates, template) {
  return templates[template] || templates.default;
}

function ModalProvider({ children, modals, templates }) {
  const [{ modalType, modalTemplate, modalProps }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const shouldShow = !!modalType;

  const reset = () => dispatch({ type: 'reset' });

  const show = ({ modalType, modalProps, modalTemplate }) =>
    dispatch({
      type: 'show',
      payload: { modalType, modalProps, modalTemplate }
    });

  const ModalTemplateComponent = resolveModalTemplateToComponent(
    templates,
    modalTemplate
  );

  return (
    <ModalStateContext.Provider value={{ show, reset }}>
      <ModalTemplateComponent
        show={shouldShow}
        onClose={reset}
        modalProps={modalProps}
      >
        {resolveModalTypeToComponent(modals, modalType)}
      </ModalTemplateComponent>
      {children}
    </ModalStateContext.Provider>
  );
}

export { ModalStateContext, ModalProvider };
