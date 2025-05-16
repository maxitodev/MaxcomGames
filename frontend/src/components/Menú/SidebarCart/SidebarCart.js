import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../../../utils/AxiosInstance';
import './SidebarCart.css';

const SidebarCart = ({ isOpen, toggleCart }) => {
  const [cart, setCart] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const token = localStorage.getItem('token');
  const isMounted = useRef(true);

  const loadCart = useCallback(async () => {
    try {
      if (!token) {
        if (isMounted.current) {
          setCart([]);
          setErrorMessage('');
        }
        return;
      }
      const response = await axiosInstance.get(`/carritos/mi-carrito?timestamp=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (isMounted.current) {
        setCart(response.data.productos || []);
        setErrorMessage('');
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Error al cargar el carrito:', error);
        setErrorMessage('Error al cargar el carrito.');
        setCart([]);
      }
    }
  }, [token]);

  useEffect(() => {
    isMounted.current = true;
    loadCart();
    return () => { isMounted.current = false; };
  }, [token, isOpen, loadCart]);

  const removeProduct = async (productId) => {
    try {
      const numericProductId = Number(productId);
      await axiosInstance.delete(`/carritos/remove-all-from-cart/${numericProductId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setErrorMessage('');
      loadCart();
    } catch (error) {
      console.error('Error al eliminar:', error);
      setErrorMessage('No se pudo eliminar el producto');
    }
  };

  const adjustQuantity = async (productId, action) => {
    const numericProductId = Number(productId);
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      setErrorMessage('Debes iniciar sesión para modificar el carrito.');
      return;
    }

    try {
      if (action === 'increase') {
        await axiosInstance.post('/carritos/add-to-cart', { productId: numericProductId, quantity: 1 }, {
          headers: { Authorization: `Bearer ${currentToken}` }
        });
      } else {
        await axiosInstance.delete(`/carritos/remove-from-cart/${numericProductId}`, {
          data: { quantity: 1 },
          headers: { Authorization: `Bearer ${currentToken}` }
        });
      }
      setErrorMessage('');
      loadCart();
    } catch (error) {
      console.error('❌ Error al ajustar cantidad:', error.response?.data);
      setErrorMessage('Error al modificar la cantidad');
    }
  };

  const calculateTotal = () =>
    cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0).toFixed(2);

  const handleCheckout = () => {
    if (cart.length === 0) {
      setErrorMessage('Tu carrito está vacío');
      return;
    }
    setErrorMessage('');
    window.location.href = token ? '/procesopago' : '/login';
  };

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-cart-button" onClick={toggleCart}>✖</button>
      <h2>Carrito de Compra ({cart.length})</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="cart-preview">
        {cart.length > 0 ? (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p>ID: {item.id}</p>
                <p>Precio: ${item.price} MXN</p>
                <div className="quantity-controls">
                  <button onClick={() => adjustQuantity(item.id, 'decrease')}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => adjustQuantity(item.id, 'increase')}>+</button>
                </div>
                <button onClick={() => removeProduct(item.id)} className="remove-button">
                  Eliminar todo
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Tu carrito está vacío.</p>
        )}
      </div>
      <div className="cart-total">
        <h3>Total: ${calculateTotal()} MXN</h3>
      </div>
      <div className="cart-actions">
        <button onClick={handleCheckout}>Terminar Compra</button>
        <button onClick={toggleCart}>Seguir Explorando</button>
      </div>
    </div>
  );
};

export default SidebarCart;
