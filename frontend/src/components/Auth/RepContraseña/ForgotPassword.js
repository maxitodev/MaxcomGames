import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../utils/AxiosInstance';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: null, content: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post('/auth/forgot-password', { Correo: email });
      setMessage({ type: 'success', content: '✔️ Correo enviado. Revisa tu bandeja de entrada.' });
      setEmail(''); // Limpiar el campo
    } catch (error) {
      setMessage({
        type: 'error',
        content: error.response?.data?.message || '❌ Error: Correo no registrado o error del servidor'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Recuperar Contraseña</h2>
      {message.content && (
        <p className={`status-message ${message.type}`}>
          {message.content}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Enviando...' : 'Enviar Instrucciones'}
        </button>
      </form>
      <p className="back-to-login">
        <Link to="/login">Volver al Inicio de Sesión</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;