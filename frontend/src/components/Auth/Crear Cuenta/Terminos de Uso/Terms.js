import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Terms.css';

const Terms = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/register');
  };

  return (
    <div className="terms-container">
      <button className="back-button" onClick={goBack}>
        ← Volver
      </button>
      <h2>Términos de Uso</h2>
      <div className="terms-text">
        <p>
          Aquí se incluirán los términos y condiciones detallados de la plataforma.
        </p>
        <p>Por favor, lee cuidadosamente antes de continuar.</p>
      </div>
    </div>
  );
};

export default Terms;
