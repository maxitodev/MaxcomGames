import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/AxiosInstance';
import { MdShoppingCart } from 'react-icons/md';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      axiosInstance.get(`/products/search?query=${encodeURIComponent(query)}`)
        .then(response => {
          setProducts(response.data.products);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error al buscar productos:', err);
          setError('Error al buscar productos');
          setLoading(false);
        });
    }
  }, [query]);

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await axiosInstance.post('/carritos/add-to-cart', {
        productId: product.ID_Producto,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Si la respuesta es exitosa, muestra el toast
      console.log(response.data.message);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    } catch (error) {
      console.error('Error al añadir el producto:', error.response?.data || error.message);
    }
  };

  return (
    <div className="search-results-container">
      <h1>Resultados de búsqueda para "{query}"</h1>
      
      {toastVisible && (
        <div className="toast-container">
          <div className="toast">
            <MdShoppingCart className="toast-icon" />
            <span>Producto añadido al carrito</span>
          </div>
        </div>
      )}

      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && products.length === 0 && <p>No se encontraron productos</p>}
      
      <div className="productos-grid">
        {products.map(product => (
          <div key={product.ID_Producto} className="producto-card">
            <Link to={`/comprar/${product.ID_Producto}`}>
              <img 
                src={product.Imagen_URL || 'https://via.placeholder.com/650x650'} 
                alt={product.Nombre_Producto} 
                className="producto-imagen" 
              />
            </Link>
            <div className="producto-info">
              <h3 className="producto-nombre">{product.Nombre_Producto}</h3>
              <p className="producto-precio">${product.Precio} MXN</p>
              <div className="producto-buttons">
                <Link to={`/comprar/${product.ID_Producto}`} className="buy-button">
                  Comprar Ahora
                </Link>
                <button className="cart-button" onClick={() => addToCart(product)}>
                  Añadir al Carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;