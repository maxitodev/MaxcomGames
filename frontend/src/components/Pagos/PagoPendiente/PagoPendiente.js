import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PagoPendiente.css';

const PagoPendiente = () => {
  const navigate = useNavigate();

  return (
    <div className="pending-page">
      <div className="pending-container">
        <div className="pending-icon">⏳</div>
        <h1>Pago Pendiente</h1>
        <p>Tu pago está siendo procesado.</p>
        <p>Recibirás una notificación una vez que se confirme.</p>
        <div className="pending-buttons">
          <button onClick={() => navigate('/mis-pedidos')} className="pending-button">
            Ver Mis Pedidos
          </button>
          <button onClick={() => navigate('/')} className="pending-button">
            Volver a la Tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default PagoPendiente;
