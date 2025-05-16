import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';
import './MisPedidos.css';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [expanded, setExpanded] = useState({}); // Estado para controlar los pedidos expandidos
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const response = await axiosInstance.get('/pedidos/mis-pedidos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Ordenar pedidos: del más reciente al más antiguo
        const sortedPedidos = response.data.sort((a, b) => new Date(b.Fecha_Pedido) - new Date(a.Fecha_Pedido));
        setPedidos(sortedPedidos);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
      }
    };

    obtenerPedidos();
  }, [token]);

  const toggleExpanded = (pedidoId) => {
    setExpanded(prev => ({
      ...prev,
      [pedidoId]: !prev[pedidoId]
    }));
  };

  const reportarProblema = (pedido, producto) => {
    navigate('/reportar-problema', { state: { order: pedido, producto } });
  };

  const formatFechaHora = (fecha) => {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="mis-pedidos-container">
      <h1>Mis Pedidos</h1>
      {pedidos.length === 0 ? (
        <p>No tienes pedidos registrados.</p>
      ) : (
        pedidos.map(pedido => (
          <div key={pedido._id} className="pedido-card">
            <div className="pedido-header" onClick={() => toggleExpanded(pedido._id)}>
              <div className="pedido-info">
                <h2>Pedido #{pedido._id}</h2>
                <p>Fecha y hora: {formatFechaHora(pedido.Fecha_Pedido)}</p>
                <p>Estado: {pedido.Estado}</p>
              </div>
              <button className="toggle-btn">
                Ver detalles
                <span className={`arrow ${expanded[pedido._id] ? 'rotated' : ''}`}>▼</span>
              </button>
            </div>
            {expanded[pedido._id] && (
              <div className="pedido-details">
                <div className="productos-list">
                  {pedido.Productos.map(producto => (
                    <div key={producto.ID_Producto} className="producto-item">
                      <img src={producto.Imagen} alt={producto.Nombre} className="producto-imagen" />
                      <div className="producto-detalle">
                        <h4>{producto.Nombre}</h4>
                        <p>Cantidad: {producto.Cantidad}</p>
                        <p>Precio: ${producto.PrecioUnitario.toFixed(2)} MXN</p>
                        <button className="report-btn" onClick={() => reportarProblema(pedido, producto)}>
                          Reportar problema
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="monto-breakdown">
                  <p>Total: ${pedido.MontoTotal.toFixed(2)}</p>
                  <p>Código de descuento: {pedido.Codigo_Descuento || 'N/A'}</p>
                  <p>Método de pago: {pedido.MetodoPago}</p>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MisPedidos;