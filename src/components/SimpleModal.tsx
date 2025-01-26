import React from 'react';

interface SimpleModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const modalStyle: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  height: '50em',
  width: '40em',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  padding: '2rem',
  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
  zIndex: 1000,
  maxHeight: '90vh',
  overflowY: 'auto',
  borderRadius: '8px',
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 999,
};

const SimpleModal = ({ children, onClose }: SimpleModalProps) => {
  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={modalStyle}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>
        {children}
      </div>
    </>
  );
};

export default SimpleModal;
