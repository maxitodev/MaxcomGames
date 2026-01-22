import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PagoInvalido.css';

const PagoInvalido = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon">✕</div>
        <h1>Pago Rechazado</h1>
        <p>Lo sentimos, hubo un problema con tu pago.</p>
        <p>Por favor, intenta nuevamente o utiliza otro método de pago.</p>
        <div className="error-buttons">
          <button onClick={() => navigate('/procesopago')} className="error-button">
            Volver a Intentarlo
          </button>
          <button onClick={() => navigate('/')} className="error-button">
            Volver a la Tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default PagoInvalido;
