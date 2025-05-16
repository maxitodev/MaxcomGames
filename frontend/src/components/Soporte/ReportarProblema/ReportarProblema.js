import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/AxiosInstance';
import './ReportarProblema.css';

const ReportarProblema = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, producto } = location.state || {};
  const [detalles, setDetalles] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [buttonText, setButtonText] = useState("Enviar Reporte");

  const validateForm = () => {
    let errors = {};
    if (!detalles.trim()) errors.detalles = 'Por favor describe el problema';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsProcessing(true);
    setButtonText("Enviando...");

    try {
      await axiosInstance.post('/soporte/report', {
        orderId: order?._id,
        producto,
        detalles,
      });
      setFormErrors({});
      setIsProcessing(false);
      setButtonText("Reporte enviado con éxito");
      setTimeout(() => navigate('/mis-pedidos'), 5000);
    } catch (error) {
      console.error('Error al enviar reporte:', error);
      setIsProcessing(false);
      setButtonText("Ocurrió un error al enviar el reporte");
    }
  };

  // Determina la clase del botón de acuerdo al estado
  let buttonClass = "submit-button";
  if (buttonText === "Enviando...") {
    buttonClass += " sending";
  } else if (buttonText === "Reporte enviado con éxito") {
    buttonClass += " success";
  } else if (buttonText === "Ocurrió un error al enviar el reporte") {
    buttonClass += " error";
  }

  if (!order || !producto) {
    return (
      <div className="error-container">
        <p>No se recibieron datos del pedido. Regresa a la página anterior.</p>
      </div>
    );
  }

  return (
    <div className="reportar-problema-container">
      {isProcessing && (
        <div className="processing">
          Enviando...
        </div>
      )}
      <h1>Reporte de Problema</h1>
      <div className="order-info">
        <h2>Pedido #{order._id}</h2>
        <p><strong>Fecha:</strong> {new Date(order.Fecha_Pedido).toLocaleDateString()}</p>
        <p><strong>Estado:</strong> {order.Estado}</p>
      </div>
      <div className="producto-info">
        <h3>Producto con Problema</h3>
        <img src={producto.Imagen} alt={producto.Nombre} />
        <div className="producto-info-text">
        <p><strong>Nombre:</strong> {producto.Nombre}</p>
        <p><strong>Cantidad:</strong> {producto.Cantidad}</p>
        <p><strong>Precio:</strong> ${producto.PrecioUnitario.toFixed(2)} MXN</p>
        </div>
      </div>
      <form className="reporte-form" onSubmit={handleSubmit}>
        {formErrors.submitError && <p className="error-message">{formErrors.submitError}</p>}
        <h3>Describe el problema</h3>
        <textarea
          value={detalles}
          onChange={(e) => setDetalles(e.target.value)}
          placeholder="Describe el problema que presentas..."
          className={formErrors.detalles ? 'error' : ''}
        />
        {formErrors.detalles && <p className="error-message">{formErrors.detalles}</p>}
        <button type="submit" className={buttonClass}>{buttonText}</button>
      </form>
    </div>
  );
};

export default ReportarProblema;