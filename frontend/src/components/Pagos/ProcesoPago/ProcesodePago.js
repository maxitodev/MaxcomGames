import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../utils/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import './ProcesodePago.css';

const ProcesoPago = () => {
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountStatus, setDiscountStatus] = useState(''); // 'success', 'error', ''
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [copyNotification, setCopyNotification] = useState(''); // Nuevo estado
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const paymentFees = {
    paypal: 0.05,
    mercadopago: 0.03,
    creditcard: 0.02
  };

  
  const loadCart = useCallback(async () => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axiosInstance.get('/carritos/mi-carrito', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data.productos || []);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      setErrorMessage('Error al cargar el carrito');
    }
  }, [token, navigate]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const adjustQuantity = async (productId, action) => {
    try {
      const numericProductId = Number(productId);
      if (action === 'increase') {
        await axiosInstance.post('/carritos/add-to-cart', {
          productId: numericProductId,
          quantity: 1
        }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axiosInstance.delete(`/carritos/remove-from-cart/${numericProductId}`, {
          data: { quantity: 1 },
          headers: { Authorization: `Bearer ${token}` } }
        );
      }
      loadCart();
    } catch (error) {
      console.error('Error al modificar cantidad:', error);
      setErrorMessage('Error al actualizar el carrito');
    }
  };

  const removeProduct = async (productId) => {
    try {
      const numericProductId = Number(productId);
      await axiosInstance.delete(`/carritos/remove-all-from-cart/${numericProductId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadCart();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      setErrorMessage('Error al eliminar producto');
    }
  };

  const handleApplyDiscount = async () => {
    // Validar que se haya seleccionado un método de pago
    if (!paymentMethod) {
      setDiscountStatus('error');
      setErrorMessage('Primero selecciona un método de pago');
      return;
    }

    // Validar que el código no esté vacío antes de enviar
    if (!discountCode || discountCode.trim() === '') {
      setDiscountStatus('error');
      setErrorMessage('Por favor ingresa un código de descuento');
      return;
    }

    try {
      const response = await axiosInstance.post('/descuentos/aplicar', {
        codigo: discountCode.trim()
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDiscount(response.data.descuento);
      setDiscountApplied(true);
      setDiscountStatus('success');
      setErrorMessage('');
    } catch (error) {
      console.error('Error al aplicar descuento:', error);
      setDiscountStatus('error');
      // Mostrar mensaje específico del servidor si existe
      const serverMessage = error.response?.data?.msg;
      if (serverMessage) {
        setErrorMessage(serverMessage);
      } else {
        setErrorMessage('Código de descuento inválido');
      }
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode('');
    setDiscount(0);
    setDiscountApplied(false);
    setDiscountStatus('');
    setErrorMessage('');
  };

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const fee = paymentMethod ? subtotal * paymentFees[paymentMethod] : 0;
    const totalBeforeDiscount = subtotal + fee;
    const discountAmount = totalBeforeDiscount * (discount / 100);
    return totalBeforeDiscount - discountAmount;
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      setErrorMessage('Selecciona un método de pago');
      return;
    }

    // Mostrar ventana emergente con la dirección /sandbox y tamaño ajustado
    window.open('/sandbox', '_blank', 'width=1200,height=800');
    
    // Guardar los datos para la confirmación
    localStorage.setItem('metodoPago', paymentMethod);
    localStorage.setItem('codigoDescuento', discountCode);
    
    if (isProcessingPayment) return;
    setIsProcessingPayment(true);
  
    if (paymentMethod === 'paypal') { // Antes: 'Paypal'
      try {
        const totalAmount = calculateTotal(); 
        const roundedTotalAmount = parseFloat(totalAmount.toFixed(2));
        const response = await axiosInstance.post(
          '/payments/paypal/create-order',
          { amount: roundedTotalAmount },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        const approvalLink = response.data.approvalLink;
        if (!approvalLink) {
          throw new Error('No se encontró el enlace de aprobación');
        }
        window.location.href = approvalLink;
        navigate('/pago-pendiente'); // Navigate to PagoPendiente
      } catch (error) {
        console.error('Error PayPal:', error);
        setErrorMessage('Error al procesar el pago con PayPal');
        setIsProcessingPayment(false);
        navigate('/pago-invalido'); // Navigate to PagoInvalido
      }
    } else if (paymentMethod === 'mercadopago') { // Antes: 'Mercadopago'
      try {
        const totalAmount = calculateTotal(); 
        const roundedTotalAmount = parseFloat(totalAmount.toFixed(2));
        const response = await axiosInstance.post(
          '/payments/mercadopago/create-preference',
          { amount: roundedTotalAmount, items: cart },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        const initPoint = response.data.init_point;
        if (!initPoint) {
          throw new Error('No se encontró el enlace de inicio de pago');
        }
        window.location.href = initPoint;
      } catch (error) {
        console.error('Error Mercado Pago:', error);
        setErrorMessage('Error al procesar el pago con Mercado Pago');
        setIsProcessingPayment(false);
        navigate('/pago-invalido'); // Navigate to PagoInvalido
      }
    } else if (paymentMethod === 'creditcard') { // Antes: 'Tarjeta de Débito/Crédito'
      try {
        const totalAmount = calculateTotal();
        const response = await axiosInstance.post(
          '/payments/create-checkout-session',
          { 
            items: cart,
            total: parseFloat(totalAmount.toFixed(2)) // Enviar el total calculado
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.data.url) { // Cambiar validación a 'url'
          throw new Error('No se pudo generar la URL de pago');
        }
        
        window.location.href = response.data.url;
      } catch (error) {
        console.error('Error con Stripe:', error.response?.data || error);
        setErrorMessage(error.response?.data?.error || 'Error al procesar el pago');
        setIsProcessingPayment(false);
        navigate('/pago-invalido'); // Navigate to PagoInvalido
      }
    } else {
      navigate('/confirmacion');
      setIsProcessingPayment(false);
    }
  };

  return (
    <>
      {copyNotification && <div className="copy-notification">{copyNotification}</div>}
      <div className="proceso-pago-container">
        <div className="left-section">
          <h2>Resumen de tu compra</h2>
          <div className="product-list">
            {cart.map(item => (
              <div key={item.id} className="product-item">
                <img src={item.image} alt={item.name} />
                <div className="product-details">
                  <h4>{item.name}</h4>
                  <p>${item.price} MXN</p>
                  <div className="quantity-controls">
                    <button onClick={() => adjustQuantity(item.id, 'decrease')}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => adjustQuantity(item.id, 'increase')}>+</button>
                  </div>
                  <button 
                    onClick={() => removeProduct(item.id)} 
                    className="remove-btn"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="payment-methods">
            <h3>Método de pago</h3>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="">Selecciona un método</option>
          <option value="paypal">PayPal</option>
          <option value="mercadopago">MercadoPago</option>
          <option value="creditcard">Tarjeta de crédito/débito</option> {/* Ahora usa Stripe */}
  </select>
          </div>
          <div className={`discount-section ${discountStatus}`}>
            <div className="discount-input-wrapper">
              <input
                type="text"
                placeholder="Código de descuento"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                disabled={discountApplied}
                className={discountApplied ? 'disabled' : ''}
              />
              {discountApplied ? (
                <button onClick={handleRemoveDiscount} className="remove-discount">
                  <span>×</span>
                </button>
              ) : (
                <button onClick={handleApplyDiscount}>Aplicar</button>
              )}
            </div>
            {discountStatus === 'success' && (
              <div className="discount-message success">
                <span className="icon">✓</span>
                Descuento del {discount}% aplicado
              </div>
            )}
            {discountStatus === 'error' && errorMessage && (
              <div className="discount-message error">
                <span className="icon">!</span>
                {errorMessage}
              </div>
            )}
            {!discountApplied && discountStatus !== 'error' && (
              <p className="discount-hint">¿Eres de la UAM Cuajimalpa? Usa el código <strong>UAMC</strong></p>
            )}
          </div>
          <p className="disclaimer">* Al hacer clic en "Realizar pago", se proporcionarán las credenciales de prueba necesarias para completar la transacción.</p>
        </div>
        <div className="right-section">
          <div className="payment-summary">
            <h2>Total a pagar</h2>
            <div className="breakdown">
              <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
              {paymentMethod && (
              <p>Service Fee ({paymentFees[paymentMethod] * 100}%): ${(calculateSubtotal() * paymentFees[paymentMethod]).toFixed(2)}</p>
            )}
            {discount > 0 && (
              <p>Descuento: -${(
                (calculateSubtotal() + 
                (paymentMethod ? calculateSubtotal() * paymentFees[paymentMethod] : 0)
                ) * (discount / 100)
              ).toFixed(2)}</p>
            )}
            <hr />
            <h3>Total: ${calculateTotal().toFixed(2)}</h3>
            </div>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <button 
              onClick={handlePayment} 
              className="pay-button"
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? 'Procesando...' : 'Realizar pago'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProcesoPago;