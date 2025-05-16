import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPopup.css';

const LoginPopup = ({ isOpen, togglePopup }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLoginClick = () => {
    togglePopup();
    navigate('/login');
  };

  const handleRegisterClick = () => {
    togglePopup();
    navigate('/register');
  };

  return (
    <div className="login-popup">
      <button className="close-popup" onClick={togglePopup}>✖</button>
      <button className="popup-button" onClick={handleLoginClick}>Ingresar</button>
      <button className="popup-button" onClick={handleRegisterClick}>Crear Cuenta</button>
    </div>
  );
};

export default LoginPopup;
