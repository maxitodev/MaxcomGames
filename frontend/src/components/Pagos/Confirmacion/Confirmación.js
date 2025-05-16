import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/AxiosInstance';
import './Confirmacion.css';

const Confirmacion = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const alreadyConfirmed = useRef(false);

  useEffect(() => {
    const confirmarPedido = async () => {
      try {
        // Recuperar los datos almacenados, o usar valores por defecto
        const metodoPago = localStorage.getItem('metodoPago') || 'paypal';
        const codigoDescuento = localStorage.getItem('codigoDescuento') || '';

        await axiosInstance.post(
          '/pedidos/confirmar',
          { metodoPago, codigoDescuento },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Pedido confirmado y carrito eliminado');
        // Opcional: limpiar los datos del localStorage
        localStorage.removeItem('metodoPago');
        localStorage.removeItem('codigoDescuento');
      } catch (error) {
        console.error('Error al confirmar el pedido:', error);
      }
    };

    if (!alreadyConfirmed.current) {
      alreadyConfirmed.current = true;
      confirmarPedido();
    }
  }, [token]);

  return (
    <div className="confirmation-container">
      <h1>Pago Aprobado</h1>
      <p>¡Gracias por tu compra!</p>
      <p>En un momento tus productos serán enviados a tu correo electrónico.</p>
      <div className="confirmation-buttons">
        <button onClick={() => navigate('/mis-pedidos')} className="confirmation-button">
          Ir a Mis Pedidos
        </button>
        <button onClick={() => navigate('/')} className="confirmation-button">
          Volver a la tienda
        </button>
      </div>
    </div>
  );
};

export default Confirmacion;
