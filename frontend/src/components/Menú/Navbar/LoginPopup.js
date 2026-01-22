import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPopup.css';

const LoginPopup = ({ isOpen, togglePopup }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    togglePopup();
    navigate('/login');
  };

  const handleRegisterClick = () => {
    togglePopup();
    navigate('/register');
  };

  return (
    <>
      {/* Overlay oscuro */}
      <div 
        className={`login-overlay ${isOpen ? 'active' : ''}`} 
        onClick={togglePopup}
        aria-hidden="true"
      />
      
      {/* Panel de acceso */}
      <div className={`login-panel ${isOpen ? 'active' : ''}`} role="dialog" aria-modal="true">
        <div className="login-panel-header">
          <h2>Bienvenido</h2>
          <button className="close-panel" onClick={togglePopup} aria-label="Cerrar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="login-panel-content">
          <p className="login-panel-subtitle">Accede a tu cuenta para ver tus pedidos, guardar productos y más.</p>
          
          <div className="login-panel-buttons">
            <button className="panel-btn primary" onClick={handleLoginClick}>
              <span className="btn-icon">👤</span>
              <span className="btn-text">
                <strong>Iniciar Sesión</strong>
                <small>Ya tengo una cuenta</small>
              </span>
            </button>
            
            <button className="panel-btn secondary" onClick={handleRegisterClick}>
              <span className="btn-icon">✨</span>
              <span className="btn-text">
                <strong>Crear Cuenta</strong>
                <small>Soy nuevo aquí</small>
              </span>
            </button>
          </div>
        </div>
        
        <div className="login-panel-footer">
          <p>Al continuar, aceptas nuestros <a href="/terms">Términos</a> y <a href="/privacy">Privacidad</a></p>
        </div>
      </div>
    </>
  );
};

export default LoginPopup;
