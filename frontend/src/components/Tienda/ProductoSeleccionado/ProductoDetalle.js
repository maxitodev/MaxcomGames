import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/AxiosInstance';
import './ProductoDetalle.css';

function ProductoDetalle({ toggleCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificacion, setNotificacion] = useState('');
  const [stockAgotado, setStockAgotado] = useState(false);

  useEffect(() => {
    async function fetchProducto() {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProducto(response.data);
        setStockAgotado(response.data.Stock <= 0);
      } catch (error) {
        setProducto(null);
        setNotificacion('Error: Producto no encontrado');
      } finally {
        setLoading(false);
      }
    }
    fetchProducto();
  }, [id]);

  useEffect(() => {
    if (notificacion) {
      const timer = setTimeout(() => setNotificacion(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notificacion]);

  async function addToCart() {
    if (stockAgotado) {
      setNotificacion('Error: Producto agotado');
      throw new Error('Producto agotado');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setNotificacion('Debes iniciar sesión para agregar productos al carrito');
      navigate('/login');
      throw new Error('No se encontró el token');
    }

    try {
      await axiosInstance.post('/carritos/add-to-cart', {
        productId: producto.ID_Producto,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotificacion('Producto agregado al carrito');
      toggleCart();
    } catch (error) {
      setNotificacion(`Error: ${error.response?.data?.message || error.message}`);
      throw error;
    }
  }

  if (loading) return <div className="loading">Cargando...</div>;
  if (!producto) return <div className="error">Producto no encontrado</div>;

  const handleBuyNow = async () => {
    try {
      await addToCart();
      navigate('/procesopago');
    } catch (error) {
      // Los errores ya se manejan con notificaciones en addToCart
    }
  };

  return (
    <div className="producto-detalle-container">
      {notificacion && (
        <div className={`notificacion ${notificacion.includes('Error') ? 'error' : 'success'}`}>
          {notificacion}
        </div>
      )}
      
      <div className="producto-imagen">
        <img 
          src={producto.Imagen_URL || 'https://via.placeholder.com/400x400.png?text=Imagen+no+disponible'} 
          alt={producto.Nombre_Producto} 
          className="imagen-producto"
        />
      </div>
      
      <div className="producto-info">
        <h1 className="nombre-producto">{producto.Nombre_Producto}</h1>
        <p className="precio">${producto.Precio} MXN</p>
        <p className={`stock ${stockAgotado ? 'agotado' : ''}`}>
          {stockAgotado ? 'Agotado' : `Disponibles: ${producto.Stock}`}
        </p>
        <p className="descripcion">{producto.Descripción}</p>
        
        <div className="botones">
          <button 
            className="comprar-ahora" 
            onClick={handleBuyNow}
            disabled={stockAgotado}
          >
            Comprar Ahora
          </button>
          
          <button 
            className={`añadir-carrito ${stockAgotado ? 'disabled' : ''}`} 
            onClick={async () => {
              try {
                await addToCart();
              } catch (error) {
                // Los errores ya se manejan en addToCart con notificaciones
              }
            }}
            disabled={stockAgotado}
          >
            {stockAgotado ? 'Sin Stock' : 'Añadir al Carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;