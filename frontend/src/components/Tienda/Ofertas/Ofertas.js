import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Ofertas.css';
import axiosInstance from '../../../utils/AxiosInstance';

const Ofertas = ({ toggleCart }) => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const response = await axiosInstance.get('/products', { params: { categoria: 'oferta' } });
        setProductos(response.data.products);
      } catch (error) {
        console.error('Error al obtener ofertas:', error);
      }
    };
    fetchOfertas();
  }, []);

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      await axiosInstance.post('/carritos/add-to-cart', {
        productId: product.ID_Producto,
        quantity: 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toggleCart();
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
    }
  };

  return (
    <div className="ofertas-container">
      <h1 className="ofertas-titulo">🔥 Ofertas Especiales</h1>
      
      <div className="productos-grid">
        {productos.map((producto) => (
          <div key={producto.ID_Producto} className="producto-card">
            <Link to={`/comprar/${producto.ID_Producto}`}>
              <img 
                src={producto.Imagen_URL} 
                alt={producto.Nombre_Producto}
                className="producto-imagen"
                onError={(e) => e.target.src = 'https://via.placeholder.com/650x650'} 
              />
            </Link>
            
            <div className="producto-info">
              <h3 className="producto-nombre">{producto.Nombre_Producto}</h3>
              <p className="producto-precio">
                ${producto.Precio} MXN
                <span className="descuento-tag">-30%</span>
              </p>
              
              <div className="producto-botones">
                <Link 
                  to={`/comprar/${producto.ID_Producto}`} 
                  className="comprar-button"
                >
                  Comprar Ahora
                </Link>
                <button 
                  className="carrito-button"
                  onClick={() => addToCart(producto)}
                >
                  🛒 Añadir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ofertas;