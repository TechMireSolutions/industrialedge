import React, { createContext, useContext, useState, useCallback } from 'react';

const ConfirmContext = createContext();

export const useConfirm = () => {
  return useContext(ConfirmContext);
};

export const ConfirmProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  const confirm = useCallback((message, title = 'Confirm Action') => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        title,
        message,
        onConfirm: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        },
      });
    });
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {modalState.isOpen && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1055, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
              <div className="modal-content border-0 shadow-lg text-center p-4" style={{ borderRadius: '24px' }}>

                <div className="d-flex justify-content-center mb-3 mt-2">
                  <div style={{ width: '64px', height: '64px', backgroundColor: '#FFF0F0', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={modalState.title.toLowerCase().includes('delete') || modalState.title.toLowerCase().includes('remove') ? "fas fa-trash-alt text-danger fs-3" : "fas fa-exclamation-triangle text-warning fs-3"}></i>
                  </div>
                </div>

                <h5 className="fw-bold mb-2" style={{ color: '#111827', fontFamily: "'Outfit', sans-serif", fontSize: '20px' }}>
                  {modalState.title}
                </h5>

                <p className="text-muted mb-4" style={{ fontSize: '14px', fontFamily: "'Inter', sans-serif", lineHeight: '1.5' }}>
                  {modalState.message}
                </p>

                <div className="d-flex justify-content-center gap-3 mb-2">
                  <button
                    type="button"
                    className="btn bg-white"
                    onClick={modalState.onCancel}
                    style={{ borderRadius: '12px', padding: '10px 24px', fontWeight: '600', color: '#111827', border: '1px solid #E5E7EB', flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={modalState.onConfirm}
                    style={{ borderRadius: '12px', padding: '10px 24px', fontWeight: '600', backgroundColor: '#DC2626', borderColor: '#DC2626', flex: 1 }}
                  >
                    {modalState.title.toLowerCase().includes('delete') || modalState.title.toLowerCase().includes('remove') ? 'Delete' : 'Confirm'}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}
    </ConfirmContext.Provider>
  );
};
