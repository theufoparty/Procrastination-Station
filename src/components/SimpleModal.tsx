import React, { useEffect, useState } from 'react';

interface SimpleModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const SimpleModal = ({ children, onClose }: SimpleModalProps) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    height: isSmallScreen ? '100%' : '50%',
    width: isSmallScreen ? '100%' : '60%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    borderRadius: isSmallScreen ? '0px' : '20px',
    padding: '20px',
    zIndex: 1000,
    overflowY: 'auto',
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

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '3em',
    cursor: 'pointer',
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={modalStyle}>
        <button onClick={onClose} style={closeButtonStyle}>
          &times;
        </button>
        {children}
      </div>
    </>
  );
};

export default SimpleModal;
